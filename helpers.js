const bcrypt = require("bcryptjs");

// Random string generator //
const generateRandomString = () => {
  let str = Math.random().toString(36).substring(2, 8);
  return str;
};

// Check if the user object exists in the database - by email: //
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
};

// Check if the password matches //
const checkIfPasswordMatches = function(email, password, database) {
  for (const id in database) {
    if (database[id].email === email) {
      if (bcrypt.compareSync(password, database[id].password)) {
        return database[id];
      }
    }
  }
  return undefined;
};

// Function that returns a list of URLs associated with the userID
const urlsForUser = function(id, database) {
  let urls = {};
  for (let url in database) {
    if (database[url].userID === id) {
      urls[url] = database[url];
    }
  }
  return urls;
};

module.exports = {
  getUserByEmail,
  checkIfPasswordMatches,
  urlsForUser,
  generateRandomString,
};
