const express = require("express");
const Author = require("../models/author");
const router = express.Router();

// All authors route
router.get("/", async (req, res) => {
  try {
    // get all authors
    const authors = await Author.find({});
    // render authors/index, passing authors to the template
    res.render("authors/index", { authors });
  } catch (error) {
    res.redirect("/");
  }
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
    // res.redirect(`author/${newAuthor.id}`);
    res.redirect("authors");
  } catch (error) {
    // if error occurs, render authors/new and auto populate the fields with what the user entered
    res.render("authors/new", {
      author: author,
      errorMsg: "Error creating author",
    });
  }
});

module.exports = router;
