const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs"); // set view engine to use ejs
app.set("views", __dirname + "/views"); // set where our views will come from
app.set("layout", "layouts/layout"); // every single view will be 'put inside' this layout file, so things like our header / footer dont need to be duplicated for each view
app.use(expressLayouts); // ensure express uses express layouts
app.use(express.static("public")); // set express to use public files located in public folder

app.listen(process.env.PORT || 3000, () => console.log(`Server running...`));
