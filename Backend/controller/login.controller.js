import Userlogin from "../models/userlogin.model.js"; // Importing the Userlogin model for database interaction
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { z } from "zod"; // Importing zod for schema validation
import createTokensAndSaveCookies from "../jwt/AuthToken.js"; // Custom JWT utility for token creation and cookie handling

import jwt from 'jsonwebtoken';

// Define a Zod schema for user input validation
const userSchema = z.object({
  email: z.string().email({ message: "Invalid Email address" }), // Validates the email format
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }) // Minimum length validation
    .max(20, { message: "Username is too long" }), // Maximum length validation
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }), // Minimum length validation
});

// Controller for user registration
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extracting user inputs from the request body

    console.log("Hello, I am Register Method....", req.body); // Debugging log

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate user inputs using Zod schema
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      // Extract validation error messages
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ error: errorMessage });
    }

    // Check if a user with the same email already exists
    const user = await Userlogin.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User is already registered" });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new Userlogin({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user document to the database
    await newUser.save();

    // If the user is successfully saved, create a JWT and save it as a cookie
    if (newUser) {
      let token = await createTokensAndSaveCookies(newUser._id, res); // Generate token and store in cookies
      console.log("Signup: ", token); // Debugging log
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        token: token,
      });
    }
  } catch (error) {
    // Log any errors and respond with an internal server error status
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill required fields' });
    }

    const user = await Userlogin.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token and set as a cookie
    const token = await createTokensAndSaveCookies(user._id, res);
    console.log("Login: Token generated: ", token);
    
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server error' });
  }
};

// Controller for user logout
export const logout = (req, res) => {
  try {
    // Clear the JWT cookie from the client
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    // Log any errors and respond with an internal server error status
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
