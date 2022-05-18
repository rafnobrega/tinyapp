const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// ##### VIEW ENGINE ##### //
app.set("view engine", "ejs");

// #### RANDOM shortURL GENERATOR ##### // 
function generateRandomString() {
  let str = Math.random().toString(36).slice(2, 8);
  console.log("THIS IS MY STR:", str);
  return str;
}


// ##### 📀 URL DB 📀 ##### //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "a1b2c3": "http://www.rafnobrega.com"
};


// ##### 💿 USER DB 💿 ##### //
const userDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
console.log("MY USER DATABASE IS HERE $$$", userDatabase);

// ##### 🍪 COOKIE-PARSER SETUP ##### //
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// ##### 🧍‍♂️ BODY-PARSER SETUP ##### //
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));


// ##### INDEX PAGE ##### //
app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
  
});

// ##### NEW URL PAGE ##### //
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// ##### SHOW URL ##### //
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
    username: req.cookies["username"],
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

// ##### 🍏 REGISTER - GET 🍏 ##### //
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
})

// ##### 🍎 REGISTER - POST 🍎 ##### //
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  // console.log("EMAIL ===>:", email)
  // console.log("PASSWORD ===>:", password);
  // console.log("ID ===>:", id);
  const newUser = {
    id,
    email,
    password
  };
  // console.log("USER ===>:", newUser);
  userDatabase[id] = {id, email, password};
  console.log("USERDATABASE ===>:", userDatabase);

  res.cookie("username", email);  
  res.cookie("user_id", id);
  res.redirect(`/urls`);
})


// ##### LOGIN ##### //
app.post("/login", (req, res) => {
  const email = req.body.username;
  if (!email) {
    return res.status(401).send("Unauthorized access - Please go back.");
  } 
   res.cookie("username", email);
   res.redirect(`/urls`);
});

// ##### LOGOUT ##### //
app.post("/logout", (req, res) => {
  const email = req.body.username;
   res.clearCookie("username", email);
   res.redirect(`/urls`);
});

// ##### CREATE NEW URL ##### //
app.post("/urls", (req, res) => {
  // Log the POST request body to the console
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
  const longer = req.body.longURL;
  urlDatabase[req.params.shortURL] = longer;
  return res.redirect("/urls");
});

// ##### LISTEN ##### //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
