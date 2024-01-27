export default class AppModel {
    static async getReaders() {
        try {
            const flightsResponse = await fetch(`http://localhost:5000/readers`);
            const flightsBody = await flightsResponse.json();

            if (flightsResponse.status !== 200) {
                return Promise.reject(flightsBody);
            }

            return {
                flights: flightsBody.readers,
                airplanes: flightsBody.books
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async addReader({
        readerID,
        fullName
    }) {
        try {
            const addFlightResponse = await fetch(`http://localhost:5000/readers`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        readerID,
                        fullName
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (addFlightResponse.status !== 200) {
                const addFlightBody = await addFlightResponse.json();
                return Promise.reject(addFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Читатель ${fullName} успешно добавлен`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async editReader({
        readerID,
        fullName,
    }) {
        try {
            const editFlightResponse = await fetch(
                `http://localhost:5000/readers/${readerID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        fullName,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (editFlightResponse.status !== 200) {
                const editFlightBody = await editFlightResponse.json();
                return Promise.reject(editFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `ФИО читателя успешно обновлено`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async deleteReader({ readerID }) {
        try {
            const deleteFlightResponse = await fetch(
                `http://localhost:5000/readers/${readerID}`,
                {
                    method: 'DELETE',
                }
            );

            if (deleteFlightResponse.status !== 200) {
                const deleteFlightBody = await deleteFlightResponse.json();
                return Promise.reject(deleteFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Читатель успешно удален`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    // БИЛЕТЫ
    static async addBook({
        bookID,
        author,
        title,
        amount,
    }) {
        try {
            const addTicketResponse = await fetch(
                `http://localhost:5000/books`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        bookID,
                        author,
                        title,
                        amount,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (addTicketResponse.status !== 200) {
                const addTicketBody = await addTicketResponse.json();
                return Promise.reject(addTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Книга ${title} успешно добавлена`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async editBook({
        bookID,
        author,
        title,
        amount
    }) {
        try {
            const editTicketResponse = await fetch(
                `http://localhost:5000/books/${bookID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        author,
                        title,
                        amount
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (editTicketResponse.status !== 200) {
                const editTicketBody = await editTicketResponse.json();
                return Promise.reject(editTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Книга успешно изменена`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async moveBook({
            bookID,
            srcReaderID,
            destReaderID
        }) {
        try {
            const moveTicketResponse = await fetch(
                `http://localhost:5000/readers`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        bookID,
                        srcReaderID,
                        destReaderID
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (moveTicketResponse.status !== 200) {
                const moveTicketBody = await moveTicketResponse.json();
                return Promise.reject(moveTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Книга успшено передана`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async addBookToReader({
        readerID,
        addedBookID
    }) {
        try {
            const editFlightResponse = await fetch(
                `http://localhost:5000/readers/${readerID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        addedBookID,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (editFlightResponse.status !== 200) {
                const editFlightBody = await editFlightResponse.json();
                return Promise.reject(editFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Книга успешно выдана`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async removeBookFromReader({
        readerID,
        removedBookID
    }) {
        try {
            const editFlightResponse = await fetch(
                `http://localhost:5000/readers/${readerID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        removedBookID,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (editFlightResponse.status !== 200) {
                const editFlightBody = await editFlightResponse.json();
                return Promise.reject(editFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Возврат книги успешно оформлен`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }
};