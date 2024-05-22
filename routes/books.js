const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const multer = require("multer");
const router = express.Router();

// create book cover upload path <-- see book model
const uploadPath = path.join("public", Book.coverImageBasePath);
// create imageMimeTypes, which is an array of types of image files we'll accept
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
// use multer library
const coverImageFileUpload = multer({
  dest: uploadPath, // destination path
  fileFilter: (req, file, callback) => {
    // a filter method
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// All books route
router.get("/", async (req, res) => {
  res.render("books/index");
});

// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create book route
router.post("/", coverImageFileUpload.single("cover"), async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;
  console.log("req.file: ", req.file);
  console.log("filename: ", filename);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: filename,
    description: req.body.description,
  });

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

module.exports = router;
