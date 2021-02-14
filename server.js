// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const bodyParser = require('body-parser'); //enables post requests
const app = express();
const fs = require('fs'); //enables file access
const mysql = require('mysql2');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// make all the files in 'public' available
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