const express = require('express');
const router = express.Router();
const db = require('../db');

// List all books
router.get('/', async (req, res) => {
  try {
    
     const allowedSorts = ['date_read', 'rating', 'title']; // ✅ whitelist of safe columns
    const sort = allowedSorts.includes(req.query.sort) ? req.query.sort : 'date_read';
    const result = await db.query(`SELECT * FROM books ORDER BY ${sort} DESC`);
    res.render('index', { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
});

// Render add form
router.get('/add', (req, res) => {
  res.render('add');
});

// Add a book
router.post('/add', async (req, res) => {
  const { title, author, date_read, rating, notes, cover_url } = req.body;
  await db.query('INSERT INTO books (title, author, date_read, rating, notes, cover_url) VALUES ($1, $2, $3, $4, $5, $6)',
    [title, author, date_read, rating, notes, cover_url]);
  res.redirect('/');
});

// Render edit form
router.get('/edit/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
  res.render('edit', { book: result.rows[0] });
});

// Edit book
router.post('/edit/:id', async (req, res) => {
  const { title, author, date_read, rating, notes, cover_url } = req.body;
  await db.query('UPDATE books SET title=$1, author=$2, date_read=$3, rating=$4, notes=$5, cover_url=$6 WHERE id=$7',
    [title, author, date_read, rating, notes, cover_url, req.params.id]);
  res.redirect('/');
});

// Delete book
router.post('/delete/:id', async (req, res) => {
  await db.query('DELETE FROM books WHERE id = $1', [req.params.id]);
  res.redirect('/');
});

module.exports = router;
