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
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    // save new author to database
    const newAuthor = await author.save();
    // if success redirect to newly created author
    res.redirect(`author/${newAuthor.id}`);
  } catch (error) {
    // if error occurs, render authors/new and auto populate the fields with what the user entered
    res.render("authors/new", {
      author: author,
      errorMsg: "Error creating author",
    });
  }
});

module.exports = router;
