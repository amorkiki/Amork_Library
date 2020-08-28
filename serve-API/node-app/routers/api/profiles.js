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
    //查询数据库中是否拥有改信息
    Profile.findOne({ b_name: req.body.b_name }).then((profile) => {
      if (profile) {
        return res.json({
          data: null,
          meta: { msg: "该图书已被添加", status: 400 },
        });
      } else {
        const profileFields = new Profile();
        // {
        // b_name: req.body.b_name,
        // author: req.body.author,
        // isbn_num: req.body.isbn_num,
        // type: req.body.type,
        // publish: req.body.publish,
        // status: req.body.status,
        // remark: req.body.remark,
        // }
        if (req.body.type) profileFields.type = req.body.type;
        if (req.body.b_name) profileFields.b_name = req.body.b_name;
        if (req.body.author) profileFields.author = req.body.author;
        if (req.body.isbn_num) profileFields.isbn_num = req.body.isbn_num;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.remark) profileFields.remark = req.body.remark;
        if (req.body.publish) profileFields.publish = req.body.publish;
        // if (!req.body.status) profileFields.status = 0;
        profileFields.save();
        res.json({
          data: profileFields,
          meta: {
            success: true,
            status: 200,
          },
        });
        if (err) return res.json(err);
      }
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
          return res.json("没找到这条内容呀@_@");
        }
        const data = profile;
        res.json({
          data,
          meta: {
            status: 200,
            success: true,
          },
        });
      })
      .catch((err) => console.log(err));
  }
);

// $route POST api/profiles/edit
// @desc  编辑信息接口
// @access private
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.b_name) profileFields.b_name = req.body.b_name;
    if (req.body.author) profileFields.author = req.body.author;
    if (req.body.isbn_num) profileFields.isbn_num = req.body.isbn_num;
    // if (req.body.status) profileFields.status = req.body.status;
    // if (req.body.remark) profileFields.remark = req.body.remark;
    if (req.body.publish) profileFields.publish = req.body.publish;

    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { returnOriginal: false }
    )
      .then((profile) => res.json(profile))
      .catch((err) => err);
  }
);

// $route POST api/profiles/delete/:id
// @desc  删除信息接口
// @access private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id }, (profile) =>
      res.json(profile)
    ).catch((err) => res.json(err));
  }
);

module.exports = router;
