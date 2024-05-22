const mongoose = require("mongoose");

// Create book schema - equivalent to a table in sql db
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  // create author relationship, referencing Author model
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

// create virtual coverImagePath property on book model
// which we can use to set book img src dynamically
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

// export newly created model, with name Book and specified schema for it
module.exports = mongoose.model("Book", bookSchema);
