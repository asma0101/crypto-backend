const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true
    },
    homeAddress: { type: String },
    cnic: { type: String },
    isBlocked: { type: Boolean },
  loginAttempts: {type: Number}
});
module.exports = mongoose.model("users", userSchema);
