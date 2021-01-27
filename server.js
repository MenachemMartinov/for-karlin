const express = require("express");
const app = express();
const config = require("config");
const mongoose = require("mongoose");

// connect to mongo server
mongoose
  .connect(config.get("mongoUrl"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.error("FAIL: could not connect to mongo", err));

// parse json body in case request's content-type is application/json
app.use(express.json());

app.use(express.static(process.cwd() + "/karlin"));
// configure routes
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

// app.get("/manager-login", (req, res) => {
//   res.redirect("/manager-login");
// });

app.get("*", (req, res) => {
  res.sendFile(process.cwd() + "/karlin/index.html");
});
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`click http://localhost:${PORT}`));
