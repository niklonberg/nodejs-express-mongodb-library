const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  let books;
  try {
    // get last 10 books added
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
    res.render("index", { books });
  } catch (error) {
    // in case of server error, set books to empty array so template can still render
    books = [];
  }
});

module.exports = router;
