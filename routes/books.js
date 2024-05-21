const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const path = require('path')
const multer = require("multer");
const router = express.Router();

// create book cover upload path <-- see book model
const uploadPath = path.join('public', Book.coverImageBasePath)
// create imageMimeTypes, which is an array of types of image files we'll accept
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
// use multer library 
const upload = multer({
  dest: uploadPath, // destination path
  fileFilter: (req, file, callback) => { // a filter method
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

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
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
});

module.exports = router;
