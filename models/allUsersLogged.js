const _ = require("lodash");

const mongoose = require("mongoose");

const LoggedSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 9999999999999,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const IsLogged = mongoose.model("IsLogged", LoggedSchema);


async function generateBizNumber() {
  while (true) {
    let randomNumber = _.random(1000, 9999999999999);
    let card = await IsLogged.findOne({ bizNumber: randomNumber });

    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = {IsLogged, generateBizNumber} ;
