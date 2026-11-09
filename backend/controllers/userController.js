// controllers/userController.js
// View and edit the profile of the logged-in user.

const { asyncHandler, httpError } = require("../utils/asyncHandler");
const { isValidPhone, isValidPincode, cleanPhone } = require("../utils/validators");
const { userResponse } = require("./authController");

// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});

// PUT /api/users/profile   (email cannot be changed)
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, city, state, pincode } = req.body;
  const user = req.user;

  if (name !== undefined) {
    if (name.trim().length < 2) throw httpError(400, "Full name is required");
    user.name = name.trim();
  }

  if (phone !== undefined) {
    if (!isValidPhone(phone)) throw httpError(400, "Enter a valid 10-digit Indian phone number");
    user.phone = cleanPhone(phone);
  }

  // PIN code is optional, but must be valid if typed
  if (pincode !== undefined && pincode !== "") {
    if (!isValidPincode(pincode)) throw httpError(400, "Enter a valid 6-digit PIN code");
  }

  if (address !== undefined) user.address = address.trim();
  if (city !== undefined) user.city = city.trim();
  if (state !== undefined) user.state = state.trim();
  if (pincode !== undefined) user.pincode = String(pincode);

  await user.save();
  res.json({ user: userResponse(user) });
});

module.exports = { getProfile, updateProfile };
