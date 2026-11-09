// controllers/authController.js
// Register, login and "who am I" logic.

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, httpError } = require("../utils/asyncHandler");
const { isValidEmail, isValidPhone, cleanPhone } = require("../utils/validators");

// Creates a login token that lasts 7 days
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Only send safe fields to the browser (never the password)
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  city: user.city,
  state: user.state,
  pincode: user.pincode,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || name.trim().length < 2) throw httpError(400, "Full name is required");
  if (!isValidEmail(email)) throw httpError(400, "Enter a valid email address");
  if (!isValidPhone(phone)) throw httpError(400, "Enter a valid 10-digit Indian phone number");
  if (!password || password.length < 6) throw httpError(400, "Password must be at least 6 characters");
  if (password !== confirmPassword) throw httpError(400, "Passwords do not match");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw httpError(400, "An account with this email already exists");

  const user = await User.create({
    name: name.trim(),
    email,
    phone: cleanPhone(phone),
    password, // hashed automatically in the User model
  });

  res.status(201).json({ token: createToken(user._id), user: userResponse(user) });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !password) throw httpError(400, "Enter your email and password");

  // select("+password") because password is hidden by default
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw httpError(401, "Invalid email or password");
  }

  res.json({ token: createToken(user._id), user: userResponse(user) });
});

// GET /api/auth/me  (needs login)
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});

module.exports = { register, login, getMe, userResponse };
