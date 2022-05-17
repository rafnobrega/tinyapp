const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//This code sets EJS as the view engine for the Express application using:
app.set("view engine", "ejs");

// Generate a Random ShortURL - this is a simulation only
function generateRandomString() {
  let str = Math.random().toString(36).slice(2, 8);
  console.log("THIS IS MY STR:", str);
  return str;
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// ##### BODY-PARSER SETUP ##### //
// Info: the body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

// define the route that will match this POST request and handle it.
//Let's start with a simple definition that logs the request body and gives a dummy response.
app.post("/urls", (req, res) => {
  console.log("req.body log:", req.body); // Log the POST request body to the console
  const longer = req.body.longURL;
  const shorter = generateRandomString(longer);
  urlDatabase[shorter] = longer;
  res.redirect(`/urls/${shorter}`); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
