const express = require("express");
const path = require("path");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override')

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.set("view engine", "ejs"); // set view engine to use ejs
app.set("views", path.resolve(__dirname, "views")); // set where our views will come from
app.set("layout", "layouts/layout"); // every single view will be 'put inside' this layout file, so things like our header / footer dont need to be duplicated for each view
app.use(expressLayouts); // ensure express uses express layouts
app.use(express.static("public")); // set express to use public files located in public folder
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(methodOverride('_method'))

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL); // connect to our database using environment variable
const db = mongoose.connection; // initiate connection
db.on("error", (error) => console.error(error)); // if error, log it
db.once("open", () => console.log("Connected to mongoose")); // log success

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

app.listen(process.env.PORT || 3000, () => console.log(`Server running...`));
