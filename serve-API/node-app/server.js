const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

//跨域问题
// npm install cors
app.use(require("cors")());

//引入user.js
const users = require("./routers/api/users");
//引入profiles.js
const profiles = require("./routers/api/profiles");
//引入bookshelf.js
const bookshelf = require("./routers/api/bookshelf");
//引入diaries.js
const diaries = require("./routers/api/diaries");

//DB config
const db = require("./config/keys").mongoURI;

// 使用 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongodb
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoDB connected"))
  .catch((error) => console.log(error));

mongoose.set("useFindAndModify", false);

// passport 初始化
app.use(passport.initialize());
// 引入passport.js代码，同时把上面const的passport传递
require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("hello node-app");
});

// 使用routers
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/bookshelf", bookshelf);
app.use("/api/diaries", diaries);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`@_@Server is running on port ${port}`);
});
