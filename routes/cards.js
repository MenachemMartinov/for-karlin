const auth = require("../middlewares/auth");
const { Card, generateBizNumber } = require("../models/card");

const router = require("express").Router();

router.post("/newCard", auth, async (req, res) => {
  // create new card
  let card = new Card({
    ...req.body,
    user_id: req.user._id,
    bizNumber: await generateBizNumber(),
  });

  // save the new card
  post = await card.save();
  res.send(post);
});

router.get("/allCards", auth, async (req, res) => {
  // get a card by id only if you are the user who created the card
  const card = await Card.find();
  if (!card) {
    return res.status(404).send("The card with the given ID was not found");
  }

  res.send(card);
});

router.get("/myCards", auth, async (req, res) => {
  try {
    console.log(req.user._id, "get id");
    const card = await Card.find();
    if (!card) {
      return res.status(404).send("The card with the given ID was not found");
    }

    res.send(card);
  } catch (error) {
    console.error("error in my cards", error);
    res.status(400).send("not find id", error);
  }
});

router.get("/:id", auth, async (req, res) => {
  // get a card by id only if you are the user who created the card
  try {
    console.log(req.user._id);
    const card = await Card.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!card) {
      return res.status(404).send("The card with the given ID was not found");
    }

    res.send(card);
  } catch (error) {
    console.error("error", error);
    res.status(400).send("nof find id");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    // update the card
    let card = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user._id,
      },
      req.body
    );
    if (!card) {
      return res.status(404).send("The card with the given ID was not found");
    }

    card = await Card.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    res.send(card);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    return res.status(404).send("The card with the given ID was not found");
  }

  res.send(card);
});

module.exports = router;
