const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const ShortUrl = require('./models/shortUrl');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const mongoDB = 'mongodb://127.0.0.1:27017/urlshort';

mongoose.connection.on('error', (error) => {
    console.error(`Error: ${error}`);
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();

    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });

    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

        if (!shortUrl) return res.sendStatus(404);

        res.redirect(shortUrl.full);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

async function startServer() {
    await mongoose.connect(mongoDB)
        .then(() => {
            console.log('MongoDB connection ready...');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });

    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
};

startServer();
