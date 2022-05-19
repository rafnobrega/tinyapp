const express = require("express");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const app = express();
const { getUserByEmail, checkIfPasswordMatches, urlsForUser } = require("./helperFunctions");
const PORT = 8080; // default port 8080

//  VIEW ENGINE  //
app.set("view engine", "ejs");

// #### RANDOM shortURL GENERATOR  // 
function generateRandomString() {
  let str = Math.random().toString(36).substring(2, 6);
  return str;
}


//  📀 URL DB 📀  //
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "user2RandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },
  a1b2c3: {
    longURL: "https://www.rafnobrega.com",
    userID: "user2RandomID",
  },
};


//  💿 USER DB 💿  //
const userDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@u.com",
    password: bcrypt.hashSync("1234", 10),
  },
};


//  🍪 COOKIE-PARSER SETUP 🍪 //
const cookieParser = require("cookie-parser");
app.use(cookieParser());


//  🧍‍♂️ BODY-PARSER SETUP 🧍‍♂️  //
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// ________________________________________________________________



//  🗂 INDEX PAGE 🗂  //
app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = { 
    user,
    urls: urlsForUser(userID, urlDatabase),
  };

  if (!userID) {
        return res.status(401).send("401: Please go back and log in; or register first.");
    }
  
  let newUserDatabase = urlsForUser(userID, urlDatabase);
  if (newUserDatabase) {
  res.render("urls_index", templateVars);
  } 
  // else {
  //   return res.status(401).send("RAFAEL WAS HERE");
  // }

});


//  🆕  NEW URL PAGE 🆕  //
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
    const user = userDatabase[userID];
  if (!userID) {
    res.redirect(`/login`);
  }
    const templateVars = {
      user,
      username: req.cookies["user_id"],
    };
  res.render("urls_new", templateVars);
});

//  🎪 SHOW URL 🎪  //
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page requested was not found. -Rafael");
  }
  const userID = req.cookies["user_id"];
  const user = userDatabase[userID];
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

//  🔄 REDIRECT SHORT URLs 🔄  //
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The page requested was not found. -Rafael");
    }
  const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  
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
  
  // Checks if email and password are empty:
  if (!email || !password) {
    return res.status(400).send("Please enter an email address and password to register.");
  }
  // Check if email already exists in the database:
  const userExist = getUserByEmail(email, userDatabase);
  if (userExist) {
    return res.status(400).send(`This email is already registered. Please use a different email address.`)
  }
  // Happy-path => Create a new user:
  const id = generateRandomString();
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = { id, email, password: hashPassword };
  userDatabase[id] = newUser;
  console.log("USERDATABASE LOG:", userDatabase);
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
  // Checks if email and password fields are empty:
  if (!email || !password) {
    return res.status(400).send("400: Please enter an email address and password to login.");
  }
  // Check if email already exists in the database:
  const userID = getUserByEmail(email, userDatabase);
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
  if (!req.cookies["user_id"]) {
    return res.send("You don't have permission to do this.");
  }
  const longer = req.body.longURL;
  const shorter = generateRandomString(longer);
  // urlDatabase[shorter] = longer;
  urlDatabase[shorter] = {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  
  res.redirect(`/urls`);
});


//  🗑 DELETE AN URL 🗑  //
app.post("/urls/:shortURL/delete", (req, res) => {
    if (!req.cookies["user_id"]) {
      return res.status(401).send("You don't have permission to do this.");
    }
  const shorter = req.params.shortURL;
  delete urlDatabase[shorter];
  res.redirect(`/urls`);
});

//  📝 EDIT AN URL 📝  //
app.post("/urls/:shortURL", (req, res) => {
    if (!req.cookies["user_id"]) {
    return res.status(401).send("You don't have permission to do this.");
  }
  const longer = req.body.longURL;
  urlDatabase[req.params.shortURL].longURL = longer;
  return res.redirect("/urls");
});

//  🎧 LISTEN 🎧  //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
