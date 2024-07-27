const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const generateToken = require("../Utils/generateToken");
const cookie = require("cookies");

// ==== Register User
// ==== POST : api/users/register
// ==== UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(402).json({ message: "Fill in all fields" });
    }

    const newEmail = email.toLowerCase();
    const emailExist = await userModel.findOne({ email: newEmail });

    if (emailExist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (password.trim().length < 6) {
      return res.status(409).json({ message: "Password is too short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      email: newEmail,
      password: hashPassword,
    });
    const token = generateToken(res, newUser);
    res.status(201).send("Registration Successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==== Login User
// ==== POST : api/users/login
// ==== UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(402).json({ message: "Please fill in all fields" });
    }

    const newEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: newEmail });
    if (!user) {
      return res.status(422).json({ message: "Invalid credentials" });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      res.status(402).json({ message: "Invalid credentials" });
    }
    generateToken(res, user);
    const { id, username, email: userEmail } = user;
    res.status(201).json({ id, username, userEmail });
  } catch (error) {
    res.status(402).json({ message: "Login failed, Please try again later" });
  }
};

// ==== Logout User
// ==== POST : api/users/logour
// ==== UNPROTECTED
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
