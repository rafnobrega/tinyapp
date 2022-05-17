const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// ##### VIEW ENGINE ##### //
app.set("view engine", "ejs");

// Generate a Random ShortURL - this is a simulation only
function generateRandomString() {
  let str = Math.random().toString(36).slice(2, 8);
  console.log("THIS IS MY STR:", str);
  return str;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// ##### BODY-PARSER SETUP ##### //
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  
});

// ##### NEW URL PAGE ##### //
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
  };
  res.render("urls_show", templateVars);
});

// ##### REDIRECT SHORT URLs ##### //
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL !== undefined) {
    res.redirect(longURL);
  } else {
    res.status(404).send("The page requested was not found. -Rafael");
  }
});

// ##### HOME  ##### //
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// ##### CREATE NEW URL ##### //
app.post("/urls", (req, res) => {
  // Log the POST request body to the console
  console.log("## CREATE NEW URL - req.body ##", req.body);
  const longer = req.body.longURL;
  const shorter = generateRandomString(longer);
  urlDatabase[shorter] = longer;
  res.redirect(`/urls`);
});


// ##### DELETE AN URL ##### //
app.post("/urls/:shortURL/delete", (req, res) => {
  const shorter = req.params.shortURL;
  delete urlDatabase[shorter];
  res.redirect(`/urls`);
});

// ##### EDIT AN URL ##### //
app.post("/urls/:shortURL", (req, res) => {
  const longer = req.body.id;
  console.log("## req.body.id ##", req.body.id);
  console.log("## longer variable ##", req.body);
  console.log("## longer ##", longer);
  urlDatabase[req.params.shortURL] = longer;

  res.redirect(`/urls/${req.params.shortURL}`);
});

// ##### LISTEN ##### //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
