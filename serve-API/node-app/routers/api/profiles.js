//
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

// $route GET api/profiles/test
// @desc  返回请求的json数据
// @access public
// router.get("/test", (req, res) => {
//   res.json({ msg: "profile works" });
// });

// $route POST api/profiles/add
// @desc  创建信息接口
// @access private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.b_name) profileFields.b_name = req.body.b_name;
    if (req.body.author) profileFields.author = req.body.author;
    if (req.body.isbn_num) profileFields.isbn_num = req.body.isbn_num;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then((profile) => {
      res.json(profile);
    });
  }
);

// $route GET api/profiles/
// @desc  获取所有信息接口
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find()
      .then((profile) => {
        if (!profile) {
          return res.status(404).json("没找到任何内容呀@_@");
        }

        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// $route GET api/profiles/:id
// @desc  获取单个信息接口
// @access private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ _id: req.params.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404).json("没找到这条内容呀@_@");
        }

        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// $route POST api/profiles/edit
// @desc  编辑信息接口
// @access private
router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.b_name) profileFields.b_name = req.body.b_name;
    if (req.body.author) profileFields.author = req.body.author;
    if (req.body.isbn_num) profileFields.isbn_num = req.body.isbn_num;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    ).then((profile) => res.json(profile));
  }
);

// $route POST api/profiles/delete/:id
// @desc  删除信息接口
// @access private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id })
      .then((profile) => {
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).res.json("删除失败啦~ >_<"));
  }
);

module.exports = router;
