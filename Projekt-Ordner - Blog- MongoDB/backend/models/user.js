const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // es darf nur ein Mal der Benutzer & die E-Mail in der Datenbank vorkommen

module.exports = mongoose.model('User', userSchema);
