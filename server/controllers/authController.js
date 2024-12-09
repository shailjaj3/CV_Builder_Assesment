const User = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

dotenv.config();

exports.register = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, username, password, contactNumber } = req.body;

    // Check if the user already exists (by email or username)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with that email or username already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password, contactNumber });
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // token expires in 1 hour
    });

    // Return success response with token and userId
    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id, // Return user ID
    });

  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    // Compare passwords using bcrypt (assumed to be in user schema)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return success response with token and userId
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id, // Return user ID
    });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
