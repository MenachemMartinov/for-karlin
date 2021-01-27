const router = require("express").Router();
const { validateUser, User } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middlewares/auth");

router.get("/user-details", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/newUser", async (req, res) => {
  try {
    console.log(req.body);
    // validate users body
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send("error 1" + error.details[0].message);
    }

    // validate user doesn't user exist already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("error 2 User already registered");
    }

    // create user and send the new user to client
    user = await new User(req.body);

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    res.send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.error("error rty", error);
  }
});

module.exports = router;
