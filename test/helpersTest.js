const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

const testUsers = {
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

describe("getUserByEmail", function() {
  it("TEST 01: should return a user with valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(expectedUserID, user);
  });
  it("TEST 02: should return undefined if we pass in an email that is not in our users database", function() {
    const user = getUserByEmail("idontexist@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(expectedUserID, user);
  });
});
