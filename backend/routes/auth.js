const express = require("express");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const {
  body,
  vlaidationResult,
  validationResult,
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "itsmeM@@hii"; //jwt secret code
//ROUTE1: create a User using:POST "/api/auth/registration" no login required
router.post(
  //User validation
  "/registration",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("cpassword", "password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //chk errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "email already used" });
      }

      //converting password into hash
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      const sec1Pass = await bcrypt.hash(req.body.password, salt);
      //create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        confirmpassword:sec1Pass
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      // res.json(user);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// ROUTE 2: Authenticate a user using POST "/api/auth/login" no login required
router.post(
  //User validation
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //chk errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

//ROUTE 3: get loggedin user details using POST "/api/auth/getUser" Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
