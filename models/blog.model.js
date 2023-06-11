const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogSchema = new Schema({
  title: { type: String, required: true },
    subtitle: { type: String },
  author: {
    type: String,
    required: true
    },
    userId: {
        type: String,
        required: true
  }
});
module.exports = mongoose.model("blogs", blogSchema);
