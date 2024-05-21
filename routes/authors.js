const express = require("express");
const Author = require("../models/author");
const router = express.Router();

// All authors route
router.get("/", (req, res) => {
  res.render("authors/index");
});

// New author route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author route
router.post("/", (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  // save new author to database
  author.save((err, newAuthor) => {
    if (err) {
      // if error occurs, render authors/new and auto populate the fields with what the user entered
      res.render("authors/new", {
        author: author,
        errorMsg: "Error creating author",
      });
    } // if success redirect to newly created author
    res.redirect(`author/${newAuthor.id}`);
  });
  res.send(author);
});

module.exports = router;
