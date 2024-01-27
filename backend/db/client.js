import pg from 'pg';

const MAX_BOOKS = process.env.APP_BACKEND__MAX_BOOKS;

export default class DB {
    #dbClient = null;
    #dbHost = '';
    #dbPort = '';
    #dbName = '';
    #dbLogin = '';
    #dbPassword = '';

    constructor() {
        this.#dbHost = process.env.DB__HOST;
        this.#dbPort = process.env.DB__PORT;
        this.#dbName = process.env.DB__DATABASE;
        this.#dbLogin = process.env.DB__USER;
        this.#dbPassword = process.env.DB__PASSWORD;

        this.#dbClient = new pg.Client({
            user: this.#dbLogin,
            password: this.#dbPassword,
            host: this.#dbHost,
            port: this.#dbPort,
            database: this.#dbName
        });
    }

    async connect() {
        try {
            await this.#dbClient.connect();
            console.log('DB connection established')
        } catch (error) {
            console.error('Unable to connect to DB: ', error)
        }
    }

    async disconnect() {
        await this.#dbClient.end();
        console.log('DB connection was closed')
    }

    // READERS TABLE

    // GET
    async getReaders() {
        try {
            const readers = await this.#dbClient.query(
                'SELECT * FROM readers;'
            );
            return readers.rows;
        } catch (error) {
            console.error('Unable to get readers. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // POST
    async addReader({
        readerID,
        fullName
    } = {
        readerID: null,
        fullName: ''
    }) {
        if (!readerID || !fullName) {
            const errMsg = `Add reader error: wrong params (readerID: ${readerID}, fullName: ${fullName})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'INSERT INTO readers (id, full_name) VALUES ($1, $2);',
                [readerID, fullName]
            );
        } catch (error) {
            console.error('Unable to create reader. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // PATCH
    async updateReader({
        readerID,
        fullName,
        addedBookID,
        removedBookID
    } = {
        readerID: null,
        fullName: '',
        addedBookID: null,
        removedBookID: null
    }) {
        if (!readerID || (!fullName && !addedBookID && !removedBookID)) {
            const errMsg = `Update reader error: wrong params (readerID: ${readerID}, fullName: ${fullName}, addedBookID: ${addedBookID}, removedBookID: ${removedBookID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            // Обновление параметров читателя
            if (fullName) {
                await this.#dbClient.query(
                    'UPDATE readers SET full_name = $2 WHERE id = $1;',
                    [readerID, fullName]
                );
            }
            // Добавление книги к читателю
            if (addedBookID) {
                const query = await this.#dbClient.query(
                    'SELECT books FROM readers WHERE id = $1;',
                    [readerID]
                );

                const books = query.rows[0]['books']

                // Проверка на максимум книг
                if (books.length >= MAX_BOOKS) {
                    const errMsg1 = `Update reader error: reader has maximum amount of books`;
                    console.error(errMsg1);
                    return Promise.reject({
                        type: 'client',
                        error: new Error(errMsg1)
                    });
                }

                // Проверка на дубликат
                for (let book of books) {
                    if (book === addedBookID) {
                        const errMsg2 = `Update reader error: reader has the book ${addedBookID}`;
                        console.error(errMsg2);
                        return Promise.reject({
                            type: 'client',
                            error: new Error(errMsg2)
                        });
                    }
                }

                // Добавление книги к читателю
                await this.#dbClient.query(
                    'UPDATE readers SET books = array_append(books, $2) WHERE id = $1;',
                    [readerID, addedBookID]
                );

                // Уменьшение запаса книг
                await this.#dbClient.query(
                    'UPDATE books SET amount = amount-1 WHERE id = $1;',
                    [addedBookID]
                );
            }
            // удаление книги из читателя
            if (removedBookID) {
                // Удаление книги из читателя
                await this.#dbClient.query(
                    'UPDATE readers SET books = array_remove(books, $2) WHERE id = $1;',
                    [readerID, removedBookID]
                );
                // Увеличение запаса книг
                await this.#dbClient.query(
                    'UPDATE books SET amount = amount+1 WHERE id = $1;',
                    [removedBookID]
                );
            }
        } catch (error) {
            console.error('Unable to update reader. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // DELETE
    async deleteReader ({ readerID } = { readerID: null }) {
        if (!readerID ) {
            const errMsg = `Delete reader error: wrong params (readerID: ${readerID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            const query = await this.#dbClient.query(
                'SELECT books FROM readers WHERE id = $1;',
                [readerID]
            );

            const books_amount = query.rows[0]['books'].length

            // Проверка на наличие книг у читателя перед удалением
            if (books_amount !== 0) {
                const errMsg1 = `Delete reader error: reader has books`;
                console.error(errMsg1);
                return Promise.reject({
                    type: 'client',
                    error: new Error(errMsg1)
                });
            }

            await this.#dbClient.query(
                'DELETE FROM readers WHERE id = $1;',
                [readerID]
            );
        } catch (error) {
            console.error('Unable to delete reader. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // BOOKS TABLE

    // GET
    async getBooks() {
        try {
            const books = await this.#dbClient.query(
                'SELECT * FROM books;'
            );
            return books.rows;
        } catch (error) {
            console.error('Unable to get books. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // POST
    async addBook({
        bookID,
        author,
        title,
        amount,
    } = {
        bookID: null,
        author: '',
        title: '',
        amount: -1
    }) {
        if (!bookID || !author || !title || (amount < 0) ) {
            const errMsg = `Create book error: wrong params (bookID: ${bookID}, author: ${author}, title: ${title}, amount: ${amount})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'INSERT INTO books (id, author, title, amount) VALUES ($1, $2, $3, $4);',
                [bookID, author, title, amount]
            );
        } catch (error) {
            console.error('Unable to create book. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // PATCH
    async updateBook({
        bookID,
        author,
        title,
        amount
    } = {
        bookID: null,
        author: '',
        title: '',
        amount: -1
    }) {
        if (!bookID || (!author && !title && (amount < 0)) ) {
            const errMsg = `Update book error: wrong params (bookID: ${bookID}, author: ${author}, title: ${title}, amount: ${amount})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            if (author) {
                await this.#dbClient.query(
                    'UPDATE books SET author = $2 WHERE id = $1;',
                    [bookID, author]
                );
            }
            if (title) {
                await this.#dbClient.query(
                    'UPDATE books SET title = $2 WHERE id = $1;',
                    [bookID, title]
                );
            }
            if (amount) {
                await this.#dbClient.query(
                    'UPDATE books SET amount = $2 WHERE id = $1;',
                    [bookID, amount]
                );
            }
        } catch (error) {
            console.error('Unable to update book. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // PATCH
    async moveBook({
        bookID,
        srcReaderID,
        destReaderID
    } = {
        bookID: null,
        srcReaderID: null,
        desReaderID: null
    }) {
        if (!bookID || !srcReaderID || !destReaderID) {
            const errMsg = `Move book error: wrong params (bookID: ${bookID}, srcReaderID: ${srcReaderID}, destReaderID: ${destReaderID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            const query = await this.#dbClient.query(
                'SELECT books FROM readers WHERE id = $1;',
                [destReaderID]
            );

            const books = query.rows[0]['books']

            // Проверка на максимум книг
            if (books.length >= MAX_BOOKS) {
                const errMsg1 = `Move book error: destination reader has maximum amount of books`;
                console.error(errMsg1);
                return Promise.reject({
                    type: 'client',
                    error: new Error(errMsg1)
                });
            }

            // Проверка на дубликат
            for (let book of books) {
                if (book === bookID) {
                    const errMsg2 = `Move book error: destination reader already has the book`;
                    console.error(errMsg2);
                    return Promise.reject({
                        type: 'client',
                        error: new Error(errMsg2)
                    });
                }
            }

            await this.#dbClient.query(
                'UPDATE readers SET books = array_append(books, $1) WHERE id = $2;',
                [bookID, destReaderID]
            );
            await this.#dbClient.query(
                'UPDATE readers SET books = array_remove(books, $1) WHERE id = $2;',
                [bookID, srcReaderID]
            );
        } catch (error) {
            console.error('Unable to move book. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }
};
