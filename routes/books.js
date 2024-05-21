const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const router = express.Router();

// All books route
router.get("/", async (req, res) => {
  res.render("books/index");
});

// New book route
router.get("/new", async (req, res) => {
  try {
    const authors = await Author.find({})
    const book = new Book()
    res.render('books/new', {
      authors,
      book
    })
  } catch (error) {
    res.redirect('/books')
  }
});

// Create book route
router.post("/", async (req, res) => {
  res.send("create books");
});

module.exports = router;
