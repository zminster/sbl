// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser"); //enables post requests
const app = express();
const http = require("http").createServer(app);
const fs = require("fs"); //enables file access
const io = require("socket.io")(http);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//const anyDB = require("any-db");
//const conn = anyDB.createConnection("sqlite3://rubric_info.db");

const dbFile = "./.data/rubric_info.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE rubric_info (rubricID TEXT, category1 TEXT, category2 TEXT, category3 TEXT, category4 TEXT, r1c1 TEXT, r1c2 TEXT, r1c3 TEXT, r1c4 TEXT, r2c1 TEXT, r2c2 TEXT, r2c3 TEXT, r2c4 TEXT, r3c1 TEXT, r3c2 TEXT, r3c3 TEXT, r3c4 TEXT, r4c1 TEXT, r4c2 TEXT, r4c3 TEXT, r4c4 TEXT)"
    );
    console.log("New tables ... created!");
  } else {
    db.serialize(() => {
      db.run('DELETE FROM rubric_info WHERE rubricID = "example"');
      db.run(
        'INSERT INTO rubric_info VALUES ("example", "category1", "category2", "category3", "category4", "1", "2", "3", "4", "1", "2", "3", "4", "1", "2", "3", "4", "1", "2", "3", "4")'
      );
    });
  }
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//using HOGAN to render HTML files
var engines = require("consolidate");
app.engine("html", engines.hogan);
app.set("views", __dirname + "/views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/views/index.html');
  res.render("index.html");
});

app.get("/makeRubric", (req, res) => {
  res.render("makerubric.html");
});

console.log("testing... testing... 1, 2, 3");

// endpoint to get all the dreams in the database
app.get("/getRubric", (request, response) => {
  // console.log(request._parsedUrl.query);
  var code = request._parsedUrl.query;

  // db.all(
  //   "SELECT * FROM rubric_info WHERE rubricID=?",
  //   [code],
  //   (err, rows) => {
  //     // console.log(rows[0].rubricID);
  //   }
  // );
  db.all("SELECT * FROM rubric_info WHERE rubricID=?", [code], (err, rows) => {
    // console.log(rows);
    response.send(rows);
  });
});

const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.post("/addRubric", function(req, res) {
  var userData = req.body;
  console.log(userData);
  var scores = userData.scores;
  //post survey form/results to srver/database

  //change  userData.rubricID to some random string
  
  var message = "";
  var isNewCode = false;
  db.all(
    "SELECT * FROM rubric_info WHERE rubricID=?",
    [userData.rubricID],
    (err, rows) => {
      if (rows.length == 0) isNewCode = true;

      if (isNewCode) {
        console.log("make row " + isNewCode);
        db.run(
          "INSERT INTO rubric_info (rubricID, category1, category2, category3, category4, r1c1, r1c2, r1c3, r1c4, r2c1, r2c2, r2c3, r2c4, r3c1, r3c2, r3c3, r3c4, r4c1, r4c2, r4c3, r4c4) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            userData.rubricID,
            userData.category1,
            userData.category2,
            userData.category3,
            userData.category4,
            userData.r1c1,
            userData.r1c2,
            userData.r1c3,
            userData.r1c4,
            userData.r2c1,
            userData.r2c2,
            userData.r2c3,
            userData.r2c4,
            userData.r3c1,
            userData.r3c2,
            userData.r3c3,
            userData.r3c4,
            userData.r4c1,
            userData.r4c2,
            userData.r4c3,
            userData.r4c4
          ]
        );
      } else {
        console.log("change");
        message = "alert";
        console.log("changed: " + message);
      }
      res.send(message);
    }
  );
});
