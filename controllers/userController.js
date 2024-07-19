const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// ==== Register User
// ==== POST : api/users/register
// ==== UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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
      name,
      email: newEmail,
      password: hashPassword,
    });
    res.status(201).json(`New user ${newUser.email} is created`);
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

    const { _id: id, name: userName, email: userEmail } = user;
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ id, userName, userEmail }, secretKey, {
      expiresIn: "1d",
    });
    res.status(201).json({ token, id, userName, userEmail });
  } catch (error) {
    res.status(402).json({ message: "Login failed, Please try again later" });
  }
};

module.exports = { registerUser, loginUser };
