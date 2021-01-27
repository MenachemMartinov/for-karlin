const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  bizVideo: {
    type: String,
    required: true,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 9999999999999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const _ = require("lodash");

const Card = mongoose.model("Card", CardSchema);


async function generateBizNumber() {
  while (true) {
    let randomNumber = _.random(1000, 9999999999999);
    let card = await Card.findOne({ bizNumber: randomNumber });

    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = {
  Card, generateBizNumber
};
