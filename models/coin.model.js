const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let coinSchema = new Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  userId: {
    type: String,
    required: true
    }
});
module.exports = mongoose.model("purchasedCoins", coinSchema);
