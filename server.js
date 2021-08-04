require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // to recognize incoming request as JSON format
app.use(express.static("public")); // to include the static files in public folder
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/userInternship", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected !!");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

// Middleware to verify Auth token
function verifyToken(req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    res.json({ auth: false });
  } else {
    req.authenticated = jwt.verify(token, process.env.JWT_SECRET);
    next();
  }
}

// app.use("/api", routes);
app.post("/user/auth/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // check if all the fields are filled
  if (!email || !password) {
    return res.json({ auth: false, error: "Enter all the required fields" });
  }

  // find if the user exists in database
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    return res.json({
      auth: false,
      error: "Details cannot be verified..Try again",
    });
  }

  // check if password matches
  if (password != foundUser.password) {
    return res.json({
      auth: false,
      error: "Details cannot be verified..Try again",
    });
  }

  // signing a jwt token with a secret
  const token = jwt.sign(
    {
      user: foundUser._id,
    },
    process.env.JWT_SECRET
  );

  // console.log(token);
  // res.json({ auth: true, token: token });
  // sending token inside a cookie
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30000000000),
    })
    .json({ auth: true })
    .send();
});

app.get("/user/auth/check/login", verifyToken, (req, res) => {
  if (!req.authenticated) {
    return res.json({ auth: false });
  } else {
    return res.json({ auth: true });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 8080 !!");
});
