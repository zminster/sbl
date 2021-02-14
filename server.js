const express = require('express');
const bodyParser = require('body-parser'); //enables post requests
const app = express();
const fs = require('fs'); //enables file access
const mysql = require('mysql2');
let mustacheExpress = require("mustache-express");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  USER: "sbl_user",
  HOST: "localhost",
  PASSWORD: "spencer_brown_fan8_17",

});

// make all the files in 'public' available
app.use(express.static("public"));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());
//using HOGAN to render HTML files
app.set("views", __dirname + "/views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/views/index.html');
  res.render("index.html");
});