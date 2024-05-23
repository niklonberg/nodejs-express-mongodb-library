const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const router = express.Router();
// create imageMimeTypes, which is an array of types of image files we'll accept
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// All books route
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== "")
    // case-insensitive search for title
    query = query.regex("title", new RegExp(req.query.title, "i"));

  if (req.query.publishedBefore != null && req.query.publishedBefore !== "")
    // check that publishedBefore date is less than the books publishDate
    query = query.lte("publishDate", req.query.publishedBefore);

  if (req.query.publishedAfter != null && req.query.publishedAfter !== "")
    // check for greater than
    query = query.gte("publishDate", req.query.publishedAfter);

  try {
    const books = await query.exec();
    res.render("books/index", {
      books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
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
  saveCover(book, req.body.cover);

  try {
    const newBook = await Book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

// Show book route
router.get("/:id", async (req, res) => {
  try {
    // populate author field with author data
    // without populate, author field in book would just be an id
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", { book });
  } catch (error) {
    res.redirect("/");
  }
})

// Edit book route
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    res.redirect("/");
  }
});

// Update book route
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`books/${book.id}`);
  } catch (error) {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError) {
      if (form === "edit") params.errorMsg = "Error updating book";
      else params.errorMsg = "Error creating book";
    }
    res.render(`books/${form}`, params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
