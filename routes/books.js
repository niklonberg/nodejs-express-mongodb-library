const express = require("express");
const Book = require("../models/book");
const router = express.Router();

// All books route
router.get("/", async (req, res) => {
  res.send("All books");
});

// New book route
router.get("/new", (req, res) => {
  res.send("New books");
});

// Create book route
router.post("/", async (req, res) => {
  res.send("create books");
});

module.exports = router;
