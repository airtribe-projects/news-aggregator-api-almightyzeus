const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: { type: [String], default: [] },
  readArticles: { type: [String], default: [] }, // store article IDs or URLs
  favoriteArticles: { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);
