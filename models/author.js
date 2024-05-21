const mongoose = require("mongoose");

// Create author schema - equivalent to a table in sql db
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// export newly created model, with name Author and specified schema for it
module.exports = mongoose.model("Author", authorSchema);
