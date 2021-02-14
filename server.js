const express = require('express');
const bodyParser = require('body-parser'); //enables post requests
const app = express();
const {
  uuid: v4
} = require('uuid');
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

app.post("/addRubric", async (req, res) => {
  connection.query("SELECT id FROM rubrics WHERE title=? AND unique_id=?", [req.body.title, req.body.rubricID], async (err, num) => {
    if (err) console.log(err);
    if (num.length) {
      res.end("alert");
    } else {
      connection.query("INSERT INTO rubrics (title, unique_id) VALUES (?, ?)", [req.body.title, req.body.rubricID], async (err) => {
        if (err) console.log(err);
        connection.query("SELECT id FROM rubrics WHERE title=? AND unique_id=?", [req.body.title, req.body.rubricID], async (err, rubric_id) => {
          if (err) console.log(err);
          async function createRubric(id, standard, l1, l2, l3, l4) {
            return new Promise((resolve, reject) => {
              connection.query("INSERT INTO category (rubric_id, standard, level_one, level_two, level_three, level_four) VALUES (?, ?, ?, ?, ?, ?)", [id, standard, l1, l2, l3, l4], async (err) => {
                if (err) reject(err);
                resolve();
              });
            });
          }
          let itemRunner = req.body;
          let category = [];
          for (let i = 0; i < req.body.standard_count; i++) {
            category[i] = [];
            for (row in itemRunner) {
              let row_val = row.split(" ");
              if (parseInt(row_val, 10) == i) {
                category[i][parseInt(row_val[1], 10)] = req.body[row.toString()];
              }
            }
            await createRubric(rubric_id[0].id, category[i][0], category[i][1], category[i][2], category[i][3], category[i][4]);
            try {
              console.log("entering into db");
            } catch (error) {
              console.log(error);
            }
          }
        });
      });
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
          let inner = {};
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
  let id = uuidv4();
  connection.query("INSERT INTO response (id, rubric_id) VALUES (?, ?)", [id, req.body.rubric_id], (err) => {
    if (err) console.log(err);
    connection.query("SELECT id FROM response WHERE id=?", id, (err, response_id) => {
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