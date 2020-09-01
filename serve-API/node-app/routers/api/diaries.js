const express = require("express");
const router = express.Router();
const passport = require("passport");

const Diaries = require("../../models/Diaries");

// $route GET api/diaries/test
// @desc  返回请求的json数据
// @access public
router.get("/test", (req, res) => {
  res.json({ msg: "profile works" });
});

// $route POST api/diaries/add
// @desc  闯将日记
// @access private
router.get(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const diariesFields = {};
  }
);

module.exports = router;
