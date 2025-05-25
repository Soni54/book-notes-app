const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const booksRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', booksRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
