const express = require('express');
const bodyParser = require('body-parser'); //enables post requests
const app = express();
const fs = require('fs'); //enables file access
const mysql = require('mysql2');
let mustacheExpress = require("mustache-express");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  user: 'sbl_user',
  host: 'localhost',
  password: 'spencer_brown_fan8_17',
  database: 'sbldb',
  insecureAuth: true
});

// make all the files in 'public' available
app.use(express.static("public"));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());
//using HOGAN to render HTML files
app.set("views", __dirname + "/views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/makeRubric", (req, res) => {
  res.sendFile(__dirname + '/views/makerubric.html');
});

app.post("/addRubric", (req, res) => {
  connection.query("SELECT id FROM rubrics WHERE title=?", req.body.rubricID, (err, num) => {
    if (err) console.log(err);
    if (num.length) {
      res.end("alert");
    }
  });
});

app.get("/getRubric/:code", (req, res) => {
  connection.query("SELECT id, title FROM rubrics WHERE unique_id=?", req.params.code, (err, id) => {
    if (err) console.log(err);
    if (id.length) {
      let obj = {};
      obj.title = id[0].title;
      obj.id = id[0].id;
      obj.standards = [];
      connection.query("SELECT standard, id, level_one, level_two, level_three, level_four FROM category WHERE rubric_id=?", id[0].id, (err, standards) => {
        if (err) console.log(err);
        standards.forEach((item, index) => {
          let inner = { };
          inner.standard = item.standard;
          inner.id = item.id;
          inner.levels = [];
          inner.levels.push(item.level_one);
          inner.levels.push(item.level_two);
          inner.levels.push(item.level_three);
          inner.levels.push(item.level_four);
          obj.standards.push(inner);
        });
        console.log(obj);
        res.json(obj);
      });
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/submitRubric", (req, res) => {
  connection.query("INSERT INTO response (rubric_id) VALUES (?)", req.body.rubric_id, (err) => {
    if (err) console.log(err);
    connection.query("SELECT id FROM response WHERE rubric_id=?", req.body.rubric_id, (err, response_id) => {
      if (err) console.log(err);
      let choices = req.body.choices;
      choices.forEach((choice, index) => {
        connection.query("INSERT INTO results (response_id, category_id, value) VALUES (?, ?, ?)", [response_id[0].id, choice.id, choice.level], (err) => {
          if (err) console.log(err);
          res.end();
        });
      });
    });
  });
});

app.listen(6969, () => {
  console.log("server go vroom");
});