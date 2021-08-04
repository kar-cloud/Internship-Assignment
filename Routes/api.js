const express = require("express");
const router = express.Router();

// Post api for login
router.post("/user/auth/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
});
