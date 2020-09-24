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
// @desc  添加日记
// @access private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const diariesFields = new Diaries();
    if (req.body.dateAndTime) diariesFields.dateAndTime = req.body.dateAndTime;
    if (req.body.radioWeather)
      diariesFields.radioWeather = req.body.radioWeather;
    if (req.body.b_name) diariesFields.b_name = req.body.b_name;
    if (req.body.b_author) diariesFields.b_author = req.body.b_author;
    if (req.body.b_chapters) diariesFields.b_chapters = req.body.b_chapters;
    if (req.body.content) diariesFields.content = req.body.content;
    diariesFields.save();
    res.json({
      data: diariesFields,
      meta: { success: true, status: 200 },
    });
  }
);

// $route GET api/diaries/
// @desc 获取所有日记
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Diaries.find()
      .then((diaries) => {
        if (!diaries) {
          return res.json("没找到任何内容呀@_@");
        }
        res.json(JSON.parse(JSON.stringify(diaries)));
      })
      .catch((err) => res.json(err));
  }
);
//$route PUSH api/diaries/edit/:id
// router.push("/edit/:id", passport.authenticate("jwt", { session: false }), {
//   (req, res)=> {
//     Diaries.findOne()
//   }
// });

//$route Delete api/diaries/edit/:id
// @desc  删除信息接口
// @access private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Diaries.findOneAndRemove({ _id: req.params.id })
      .then((diaries) => {
        diaries.save().then((diaries) => res.json(diaries));
      })
      .catch((err) => res.json(err));
  }
);

module.exports = router;
