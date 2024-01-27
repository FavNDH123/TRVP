import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import DB from './db/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appHost = process.env.APP_BACKEND__HOST;
const appPort = Number(process.env.APP_BACKEND__PORT);

const app = express();

const db = new DB();

app.use('*', (req, res, next) => {
    console.log(
        req.method,
        req.baseUrl || req.url,
        new Date().toISOString()
    );
    next();
});

app.use('/', express.static(path.resolve(__dirname, '../dist')));

//                                                  BOOKS

// GET
app.get('/readers', async (req, res) => {
    try {
        const [dbReaders, dbBooks] =
           await Promise.all([db.getReaders(), db.getBooks()]);

        const books = dbBooks.map(({
            id,
            author,
            title,
            amount
        }) => ({
            bookID: id,
            author,
            title,
            amount
        }))

        const readers = dbReaders.map( reader => ({
            readerID: reader.id,
            fullName: reader.full_name,
            books: books.filter(book => reader.books.indexOf(book.bookID) !== -1)
        }))

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ readers, books });
    } catch (err) {
        res.statusCode = 500;
        res.statusMessage = 'Internal server error';
        res.json({
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `Getting readers and books error: ${err.error.message || err.error}`
        });
    }
});

// POST
app.use('/readers', express.json());
app.post('/readers', async (req, res) => {
    try {
        const {
            readerID,
            fullName
        } = req.body;

        await db.addReader({ readerID, fullName });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Create reader error: ${err.error.message || err.error}`
        });
    }
});

// PATCH
app.use('/readers/:readerID', express.json());
app.patch('/readers/:readerID', async (req, res) => {
    try {
        const { readerID } = req.params;
        const {
            fullName,
            addedBookID,
            removedBookID
        } = req.body;

        await db.updateReader({ readerID, fullName, addedBookID, removedBookID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Update reader error: ${err.error.message || err.error}`
        });
    }
});

// DELETE
app.delete('/readers/:readerID', async (req, res) => {
    try {
        const { readerID } = req.params;

        await db.deleteReader({ readerID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Delete reader error: ${err.error.message || err.error}`
        });
    }
});

//                                              BOOKS

// POST
app.use('/books', express.json());
app.post('/books', async (req, res) => {
    try {
        const {
            bookID,
            author,
            title,
            amount,
        } = req.body;

        await db.addBook({ bookID, author, title, amount });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Create book error: ${err.error.message || err.error}`
        });
    }
});

// PATCH
app.use('/books/:bookID', express.json());
app.patch('/books/:bookID', async (req, res) => {
    try {
        const { bookID } = req.params;
        const {
            author,
            title,
            amount
        } = req.body;

        await db.updateBook({ bookID, author, title, amount });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Update book error: ${err.error.message || err.error}`
        });
    }
});

// PATCH (move)
app.patch('/readers', async (req, res) => {
    try {
        const { bookID, srcReaderID, destReaderID } = req.body;

        await db.moveBook({ bookID, srcReaderID, destReaderID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Move book error: ${err.error.message || err.error}`
        });
    }
});

app.listen(appPort, appHost, async () => {
    try {
        await db.connect();
    } catch (error) {
        console.log('Library manager app shut down');
        process.exit(100);
    }

    console.log(`Library manager app started at host http://${appHost}:${appPort}`);
});

process.on('SIGTERM', () => {
   console.log('SIGTERM signal received: closing HTTP server..');
   server.close(async  () => {
       await db.disconnect();
       console.log('HTTP server was closed');
   });
});