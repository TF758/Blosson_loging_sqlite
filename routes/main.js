const { request } = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const db = new sqlite3.Database("./login.db", sqlite3.OPEN_READWRITE, err => {
  if (err) console.log(err);
});

sql =
  "CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY AUTOINCREMENT,username VARCHAR(255) NOT NULL, userpass VARCHAR(50) NOT NULL, account_type VARCHAR(20))";

db.run(sql);
console.log("Database created");

// The main.js file of your application
module.exports = function (app) {
  // render homepage
  app.get("/", (req, res, next) => {
    res.render("index.ejs");
  });
  app.get("/welcome", checkLoggedIn, (req, res, next) => {
    res.render("landing.html");
  });
  app.get("/login", checkNotLoggedIn, (req, res) => {
    res.render("login.html");
  });

  app.post("/login", function (req, res) {
    let username = req.body.username;
    let userpass = req.body.password;

    let sql = "SELECT * FROM users WHERE username =? AND userpass =?";
    db.all(sql, [username, userpass], (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      //if user does not exist
      if (rows.length == 0) {
        console.log("User does not exist");
        res.redirect("/login");
        return;
      }
      //create cookie from userId
      res.cookie("sessionUserId", rows[0].userId);
      console.log("User Logged in");
      res.redirect("/welcome");
    });
  });
  /**This function checks for cookies present if you're logged in */
  function checkLoggedIn(req, res, next) {
    sessionCookie = req.cookies["sessionUserId"];
    if (sessionCookie) {
      next();
    } else {
      console.log("user needs to log in");
      res.redirect("/login");
    }
  }
  /**This function checks that user is logged out */
  function checkNotLoggedIn(req, res, next) {
    sessionCookie = req.cookies["sessionUserId"];
    if (!sessionCookie) {
      next();
    } else {
      res.redirect("back");
    }
  }

  app.get("/logout", function (req, res) {
    res.clearCookie("sessionUserId");
    console.log("Logging you out");
    res.redirect("/login");
  });

  app.get("/register", function (req, res) {
    res.render("register.html");
  });
  app.post("/register", async (req, res) => {
    //get information from form
    username = req.body.username;
    userpass = req.body.password;
    usertype = req.body.type;

    sql = "INSERT INTO users (username,userpass,account_type) VALUES (?,?,?)";
    db.run(sql, [username, userpass, usertype], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("user registered");
      res.redirect("/");
    });
  });
  ``;
};
