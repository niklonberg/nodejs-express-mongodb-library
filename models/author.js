const mongoose = require("mongoose");
const Book = require("./book");

// Create author schema - equivalent to a table in sql db
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// add function to run before a database 'deleteOne' attempt
authorSchema.pre("deleteOne", async function (next) {
  try {
    const query = this.getFilter();
    const hasBook = await Book.exists({ author: query._id });

    if (hasBook) {
      next(new Error("This author still has books."));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

// export newly created model, with name Author and specified schema for it
module.exports = mongoose.model("Author", authorSchema);
