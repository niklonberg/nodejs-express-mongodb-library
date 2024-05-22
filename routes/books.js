const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// create book cover upload path <-- see book model
const uploadPath = path.join("public", Book.coverImageBasePath);
// create imageMimeTypes, which is an array of types of image files we'll accept
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
// use multer library
// const coverImageFileUpload = multer({
//   dest: uploadPath, // destination path
//   fileFilter: (req, file, callback) => {
//     // a filter method
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// All books route
router.get("/", async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title !== '') 
    // case-insensitive search for title
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  
  if (req.query.publishedBefore != null && req.query.publishedBefore !== '')
    // check that publishedBefore date is less than the books publishDate
    query = query.lte('publishDate', req.query.publishedBefore)
  
  if (req.query.publishedAfter != null && req.query.publishedAfter !== '') 
    // check for greater than
    query = query.gte('publishDate', req.query.publishedAfter)
  
  try {
    const books = await query.exec()
    res.render("books/index", {
      books,
      searchOptions: req.query
    });
  } catch (error) {
    res.redirect('/')
  }
});

// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create book route
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("books");
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError) params.errorMsg = "Error creating book";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router;
