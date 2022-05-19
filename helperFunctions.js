// Check if the user object exists in the database - by email: //
const checkIfUserExists = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
}

// Check if the password matches
const checkIfPasswordMatches = function (email, password, database) {
  for (const id in database) {
    if (database[id].email === email) {
      if (password === database[id].password) {
        return database[id];
      }
    }
  }
  return undefined;
};


module.exports = { checkIfUserExists, checkIfPasswordMatches }


