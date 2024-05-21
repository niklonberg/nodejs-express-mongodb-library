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
  res.send(req.body.name);
});

module.exports = router;
