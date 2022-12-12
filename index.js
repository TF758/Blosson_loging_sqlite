var http = require("http");

const express = require("express");

const path = require("path");

const sqlite3 = require("sqlite3").verbose();
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());

require("./routes/main")(app);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Application is running on port: ${port}!`));

// STATIC ASSETS:
