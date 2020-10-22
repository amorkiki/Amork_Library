// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const { findById } = require("../../models/User");
const { query } = require("express");
const { json } = require("body-parser");  //save post请求参数

// $route GET api/users/test
// @desc  返回请求的json数据
// @access public
// router.get("/test", (req, res) => {
//   res.json({ msg: "login works" });
// });

// $route POST api/users/register
// @desc  返回请求的json数据
// @access public
router.post("/register", (req, res, next) => {
  console.log(req.body);
  //查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(1).json("邮箱已被注册");
    } else {
      const avatar = gravatar.url("req.body.email", {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
        identity: req.body.identity,
        situation: req.body.situation,
        role: req.body.role,
      });
      // 给密码加密
      bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) {
          return err;
        }
        newUser.password = hash;
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => res.json(err));
      });
    }
  });
});

// $route POST api/users/login
// @desc  返回token jwt passport
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // 查询数据库
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({ msg: "用户不存在", status: 400 });
    }
    // 密码匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        if (email == "admin@123.com") {
          const rule = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            identity: user.identity,
            situation: user.situation,
            role: "manager",
          };
          jwt.sign(
            rule,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                data: rule,
                meta: {
                  success: true,
                  status: 200,
                  token: "Bearer " + token,
                },
              });
            }
          );
        } else {
          const rule = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            identity: user.identity,
            situation: user.situation,
            role: 'common',
          };
          jwt.sign(
            rule,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                data: rule,
                meta: {
                  success: true,
                  status: 200,
                  token: "Bearer " + token,
                },
              });
            }
          );
        }
      } else {
        return res.json({ msg: "密码错误", status: 400 });
      }
    });
  });
});

// $route GET api/users/current
// @desc  返回当前用户
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
      situation: user.situation,
      role: user.role,
    });
  }
);

// $route GET api/users/list
// @desc  获取用户列表接口
// @access private
router.get(
  "/list/:role/:id",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    if (req.params.role === "common") {
      User.find({ _id: req.params.id })
        .then((user) => {
          if (!user) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = user;
          res.json({
            data,
            meta: {
              status: 200,
              success: true,
            },
          });
        })
        .catch((err) => res.json(err));
    }
    if (req.params.role === "manager") {
      User.find()
        .then((user) => {
          if (!user) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = user;
          res.json({
            data,
            meta: {
              status: 200,
              success: true,
            },
          });
          // if (!user) {
          //   return res.json({ msg: "没找到任何内容呀@_@", status: 400 });
          // }
          // res.json(JSON.parse(JSON.stringify(user)));
          // // res.json(user);
        })
        .catch((err) => res.json(err));
    }
  }
);

// $route PUT api/users/edit/:id
// @desc 修改用户信息
// @access private
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userInfoFields = {};
    if (req.body.name) userInfoFields.name = req.body.name;
    if (req.body.identity) userInfoFields.identity = req.body.identity;
    if (req.body.role) userInfoFields.role = req.body.role;

    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: userInfoFields },
      { returnOriginal: false }
    )
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
    // res.json({
    //   data: userInfoFields,
    //   meta: {
    //     status: 200,
    //     success: true,
    //   },
    // });
  }
);

// $route POST api/users/add
// @desc  添加用户信息接口
// @access private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.json({
          data: null,
          meta: { msg: "该邮箱已被注册", status: 401 },
        });
      } else {
        //  头像生成
        const avatar = gravatar.url("req.body.email", {
          s: "200",
          r: "pg",
          d: "mm",
        });
        const userFields = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password,
          identity: req.body.identity,
          situation: req.body.situation,
          role:req.body.role
        });
        if (!req.body.identity) userFields.identity = "null";
        if (!req.body.situation) userFields.situation = true;
        if(!req.body.role) userFields.role="common"
        // 密码加密
        bcrypt.hash(userFields.password, 10, function (err, hash) {
          if (err) {
            return err;
          }
          userFields.password = hash;
          userFields.save();
          res.json({
            data: userFields,
            meta: {
              success: true,
              status: 200,
            },
          });
          if (err) return res.json(err);
          // .then((user) => res.json(JSON.parse(JSON.stringify(user))))
          // .catch((err) => res.json(err));
        });
      }
    });
  }
);

// $route PUT api/users/:uId/situation/:type
// @desc 修改用户状态
// @access private
router.put(
  "/:id/situation/:situation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //请求头拿到的situation信息
    //const result = req.params.situation;
    //res.json(result);
    const userSitu = {};
    if (req.params.situation) {
      //bug修复：直接用req.params.situation 赋值给userSitu.situation不起作用，
      //因为situation定义的是boolean不是string
      //用JSON.parse转换一下，使得格式变成any
      userSitu.situation = JSON.parse(req.params.situation);
      User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: userSitu },
        { returnOriginal: false }
      )
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    }
  }
);

// $route GET api/users/:id
// @desc  获取用户信息接口
// @access private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          return res.json("没找到这条内容呀@_@");
        }
        const data = user;
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
// $route DELETE api/users/:_id
// @desc  删除用户信息接口
// @access private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.params.id);
    User.findOneAndRemove({ _id: req.params.id }, (user) => {
      res.json(user);
    }).catch((err) => console.log(err));
  }
);

// $route GET api/users/find/:value/:query
// @desc  查询信息接口
// @access private
router.get(
  "/find/:value/:query",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.params.value === "1") {
      User.find({ name: req.params.query })
        .then((user) => {
          if (!user) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = user;
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
    if (req.params.value === "2") {
      User.find({ email: req.params.query })
        .then((user) => {
          if (!user) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = user;
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
    if (req.params.value === "3") {
      User.find({ identity: req.params.query })
        .then((user) => {
          if (!user) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = user;
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
  }
);

module.exports = router;
