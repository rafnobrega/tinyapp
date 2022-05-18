// Check if the user object exists in the database - by email: //
const checkIfUserExists = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
}



module.exports = { checkIfUserExists }