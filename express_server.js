const express = require("express");
const app = express();
const { checkIfUserExists, checkIfPasswordMatches } = require("./helperFunctions");
const PORT = 8080; // default port 8080

//  VIEW ENGINE  //
app.set("view engine", "ejs");

// #### RANDOM shortURL GENERATOR  // 
function generateRandomString() {
  let str = Math.random().toString(36).slice(2, 8);
  return str;
}


//  📀 URL DB 📀  //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "a1b2c3": "http://www.rafnobrega.com"
};


//  💿 USER DB 💿  //
const userDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "test",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "test2",
  },
  q: {
    id: "q",
    email: "q@q",
    password: "123",
  },
};


//  🍪 COOKIE-PARSER SETUP 🍪 //
const cookieParser = require("cookie-parser");
app.use(cookieParser());


//  🧍‍♂️ BODY-PARSER SETUP 🧍‍♂️  //
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));



// ________________________________________________________________



//  🗂 INDEX PAGE 🗂  //
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = { 
    user,
    username: req.cookies["user_id"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
  
});

//  🆕  NEW URL PAGE 🆕  //
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = {
    user,
    username: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});

//  🎪 SHOW URL 🎪  //
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

//  🔄 REDIRECT SHORT URLs 🔄  //
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL !== undefined) {
    res.redirect(longURL);
  } else {
    res.status(404).send("The page requested was not found. -Rafael");
  }
});

//  🏡 HOME 🏡  //
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//  🍏 REGISTER - GET 🍏  //
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = {
    user,
    username: req.cookies["user_id"],
  };
  res.render("register", templateVars);
})

//  🍎 REGISTER - POST 🍎  //
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  // Checks if email and password are empty:
  if (!email || !password) {
    return res.status(400).send("Please enter an email address and password to register.");
  }
  // Check if email already exists in the database:
  const checkIfEmailExists = checkIfUserExists(email, userDatabase);
  if (checkIfEmailExists) {
    return res.status(400).send(`This email is already registered. Please use a different email address to create your account.`)
  }
  // Create a new user (after passing the two checks above):
  const newUser = { id, email, password };
  userDatabase[id] = {id, email, password};
  console.log("USERDATABASE LOG:", userDatabase);

  // res.cookie("username", email);  
  res.cookie("user_id", id);
  res.redirect(`/urls`);
})


//  🪵 LOGIN 🪵  //
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = {
    user,
    username: req.cookies["user_id"],
  };
  res.render("login", templateVars);
});

//  🪵 LOGIN 🪵  //
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Checks if email and password are empty:
  if (!email || !password) {
    return res.status(400).send("400: Please enter an email address and password to login.");
  }
  // Check if email already exists in the database:
  const userID = checkIfUserExists(email, userDatabase);
  if (!userID) {
    return res.status(403).send(`403: The email cannot be found.`)
    }
  // Check if password matches with the password in the database:
  const checkPassword = checkIfPasswordMatches(email, password, userDatabase);
    if (checkPassword) {
      res.cookie("user_id", userID);
    return res.redirect(`/urls`);
    } else {
      return res.status(403).send(`403: The password provided is wrong.`);
    }
});

//  🪵 LOGOUT 🪵  //
app.post("/logout", (req, res) => {
   res.clearCookie("user_id");
   res.redirect(`/login`);
});

//  🆕 CREATE NEW URL 🆕  //
app.post("/urls", (req, res) => {
  // Log the POST request body to the console
  const longer = req.body.longURL;
  const shorter = generateRandomString(longer);
  urlDatabase[shorter] = longer;
  res.redirect(`/urls`);
});


//  🗑 DELETE AN URL 🗑  //
app.post("/urls/:shortURL/delete", (req, res) => {
  const shorter = req.params.shortURL;
  delete urlDatabase[shorter];
  res.redirect(`/urls`);
});

//  📝 EDIT AN URL 📝  //
app.post("/urls/:shortURL", (req, res) => {
  const longer = req.body.longURL;
  urlDatabase[req.params.shortURL] = longer;
  return res.redirect("/urls");
});

//  🎧 LISTEN 🎧  //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
