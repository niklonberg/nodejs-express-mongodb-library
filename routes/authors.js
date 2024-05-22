const express = require("express");
const Author = require("../models/author");
const router = express.Router();

// All authors route
router.get("/", async (req, res) => {
  let searchOptions = {};
  // use req.query to access users search term
  // ex: /authors?name=jo <-- user searched 'jo'
  if (req.query.name !== null && req.query.name !== "") {
    // use RegExp to do case-insensitive search based on name parameter.
    // jo would match john, jolene etc..
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    // get all authors
    const authors = await Author.find(searchOptions);
    // render authors/index, sending back authors and query to the template
    res.render("authors/index", { authors, searchOptions: req.query });
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
      author,
      errorMsg: "Error creating author",
    });
  }
});

router.get("/:id", (req, res) => {
  res.send(`Show author, id: ${req.params.id}`);
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render("authors/edit", { author });  
  } catch (error) {
    res.redirect('/authors')
  }
  
});

router.put("/:id", async (req, res) => {
  // save author inputs
  const author = new Author({
    name: req.body.name,
  });
  try {
    author = await author.findById(req.params.id);
    await author.save()
    res.redirect(`authors/${author.id}`);
  } catch (error) {
    // if error occurs, redirect to page and auto populate the fields
    res.render("authors/:id/edit", {
      author,
      errorMsg: "Error updating author",
    });
  }
});

router.delete("/:id", (req, res) => {
  res.send(`Delete author, id: ${req.params.id}`);
});

module.exports = router;
