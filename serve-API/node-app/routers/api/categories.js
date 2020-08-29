const express = require("express");
const router = express.Router();
const passport = require("passport");

const Categories = require("../../models/Categories");
// const bookCategories = require("../../categories.json");

// $route GET api/categories/test
// @desc  返回请求的json数据
// @access public
router.get("/test", (req, res) => {
  res.json({ msg: "categories works" });
});

// $route GET api/categories
// @desc  获取所有分类的接口
// @access public
router.get("/", (req, res) => {
  Categories.find()
    .then((categories) => {
      if (!categories) {
        return res.json("没找到任何内容呀@_@");
      }
      res.json(categories);
    })
    .catch((err) => res.json(err));
});

// $route POST api/categories/add
// @desc  创建分类的接口
// @access private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const categoriesFields = new Categories({
      cate_name: req.body.cate_name,
      children: req.body.children,
      cate_level: req.body.cate_level,
    });
    res.json(categoriesFields);
  }
);

module.exports = router;
