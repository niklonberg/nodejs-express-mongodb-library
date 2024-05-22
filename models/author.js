const mongoose = require("mongoose");
const Book = require("./book");

// Create author schema - equivalent to a table in sql db
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// add function to run before a database 'remove' (delete) attempt
authorSchema.pre("findOneAndDelete", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      // prevent author deletion if there are books with that author tied to it
      next(new Error("This author has books tied to them"));
    } else {
      // proceed with deletion
      next();
    }
  });
});

// export newly created model, with name Author and specified schema for it
module.exports = mongoose.model("Author", authorSchema);
