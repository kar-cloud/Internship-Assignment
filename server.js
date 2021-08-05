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

// connecting with a database
mongoose.connect("mongodb://localhost:27017/userInternship", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ensuring connection is developed
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected !!");
});

// creating schema for loggedin users details
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  users: [mongoose.Schema.Types.Mixed],
});

// schema for user data
const dataSchema = new mongoose.Schema({
  username: String,
  mobile: Number,
  email: String,
  address: String,
});

const User = new mongoose.model("User", userSchema);
const Data = new mongoose.model("Data", dataSchema);

// Middleware to verify Auth token
function verifyToken(req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    res.json({ auth: false });
  } else {
    req.authenticated = jwt.verify(token, process.env.JWT_SECRET);
    req.username = req.cookies.username;
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

  // const newUser = new User({
  //   email: email,
  //   password: password,
  //   users: [],
  // });
  // const savedUser = await newUser.save();

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

  // storing token inside a cookie
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30000000000),
    })
    .cookie("username", foundUser.email, {
      httpOnly: true,
      expires: new Date(Date.now() + 30000000000),
    })
    .json({ auth: true })
    .send();
});

// check if user is authenticated
app.get("/user/auth/check/login", verifyToken, (req, res) => {
  if (!req.authenticated) {
    return res.json({ auth: false });
  } else {
    return res.json({ auth: true });
  }
});

// post api for saving user data in database
app.post("/users/add", verifyToken, async (req, res) => {
  if (!req.authenticated) {
    return res.json({ auth: false });
  } else {
    const username = req.body.username;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;

    console.log(req.body);
    // checking if all fields are filled
    if (!username || !mobile || !email || !address) {
      return res.json({ error: "Enter all the required fields" });
    }

    const validUsername = /^[a-zA-Z0-9]*$/;
    const validMobile = /^\d{10}$/;
    const validEmail =
      /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+(.[a-zA-z])?$/;

    if (!username.match(validUsername)) {
      return res.json({
        error:
          "Username should contain only alphanumeric characters and no spaces",
      });
    } else if (!mobile.match(validMobile)) {
      return res.json({ error: "Mobile Number should be of 10 digits" });
    } else if (!email.match(validEmail)) {
      return res.json({ error: "Please enter a valid Email" });
    } else {
      await User.updateOne(
        { email: req.username },
        {
          $push: {
            users: {
              username: username,
              mobile: mobile,
              email: email,
              address: address,
            },
          },
        }
      );
    }

    // saving user to database collection
    // const newUser = new Data({
    //   username: username,
    //   mobile: mobile,
    //   email: email,
    //   address: address,
    // });
    // const savedUser = await newUser.save();
    // console.log(savedUser);
    return res.json({ success: "User Added Successfully" });
  }
});

// get users data
app.get("/user/data", verifyToken, async (req, res) => {
  if (!req.authenticated) {
    return res.json({ auth: false });
  } else {
    await User.findOne({ email: req.username })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(error);
      });
  }
});

// delete user data
app.post("/user/data/delete", verifyToken, async (req, res) => {
  if (!req.authenticated) {
    return res.json({ auth: false });
  } else {
    const username = req.body.username;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    User.updateOne(
      {
        users: {
          username: username,
          mobile: mobile,
          email: email,
          address: address,
        },
      },
      {
        $pull: {
          users: {
            $in: [
              {
                username: username,
                mobile: mobile,
                email: email,
                address: address,
              },
            ],
          },
        },
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Item deleted successfully");
        }
      }
    );
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 8080 !!");
});
