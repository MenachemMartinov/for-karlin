const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const {IsLogged, generateBizNumber} = require("../models/allUsersLogged");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.get("/login", auth, async (req, res) => {
  try {
    // does user logged
    let isLogged = await IsLogged.findOne({ user_id: req.user._id });
    if (isLogged) {
      return res.status(400).send("the is logged");
    }
    isLogged = new IsLogged({ user_id: req.user._id, bizNumber: await generateBizNumber() });
    console.log(isLogged);

    let isLoggedSave = await isLogged.save()
    console.log(isLoggedSave);

    // send the user a token
    res.status(200).send(req.user);
  } catch (error) {
    console.error("get log error", error);
    res.status(400).send("you not can login");
  }
});

router.post("/loginUser", async (req, res) => {
  // validate body
  console.log(req.header("my-auth-token"));
  console.log(req.header("Content-Type"));

  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }


  // does user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  user.generateAuth;
  // validate password
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(400).send("Invalid email or password");
  }

  // send the user a token
  res.send({
    token: user.generateAuthToken(),
    user: _.pick(user, ["_id", "name", "email"]),
  });
});

router.delete("/deleteIsLogged", auth, async (req, res) => {
  let isLogged = await IsLogged.findOneAndRemove({ user_id: req.user._id });
  if (isLogged) {
    return res.status(400).send("the user is logged");
  }
  res.send(isLogged);
});

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(data);
}

module.exports = router;
