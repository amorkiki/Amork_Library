const express = require("express");
const router = express.Router();
const passport = require("passport");

const Bookshelf = require("../../models/Bookshelf");

// $route GET api/bookshelf/test
// @desc  返回请求的json数据
// @access public
// router.get("/test", (req, res) => {
//   res.json({ msg: "bookshelf works" });
// });

// $route GET api/bookshelf
// @desc  获取所有书架
// @access public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
  Bookshelf.find()
    .then((bookshelf) => {
      if (!bookshelf) {
        return res.json("没找到任何内容呀@_@");
      }
      res.json(bookshelf);
    })
    .catch((err) => res.json(err));
});

// $route POST api/bookshelf/add
// @desc  创建新书架
// @access private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Bookshelf.findOne({ shelf_name: req.body.shelf_name }).then((bookshelf) => {
      if (bookshelf) {
        return res.json({
          data: null,
          meta: { msg: "该书架已被添加", success: false },
        })
      } else {
        const bookshelfFields = new Bookshelf()
        bookshelfFields.shelf_name = req.body.shelf_name,
        bookshelfFields.shelf_level =req.body.shelf_level
        
        bookshelfFields.save().then(bookshelfFields => {
          res.json({
            data: bookshelfFields,
            meta:{msg: "书架添加成功", success: true}
          })
        }).catch((err) => err);
      }
    })
  }
);


// $route PUT api/bookshelf/edit/:id
// @desc  修改书架
// @access private
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const editShelfFields = {}
    if(req.body.shelf_name) editShelfFields.shelf_name=req.body.shelf_name
    if (req.body.shelf_level) editShelfFields.shelf_name = req.body.shelf_level
    
    Bookshelf.findOneAndUpdate(
      {_id: req.params.id},
      { $set: editShelfFields },
      { returnOriginal: false }
    ).then(
      res.json({
        data: editShelfFields,
        meta:{msg:'修改书架成功',success:true}
      })
    ).catch((err)=>err)
  }
)

// $route delete api/bookshelf/delete/:id
// @desc  删除书架
// @access private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Bookshelf.findByIdAndRemove({ _id: req.params.id }).then(bookshelf => {
      bookshelf.save().then(bookshelf => {
        res.json(bookshelf)
      })
    }).catch(err=>err)
  }
)
module.exports = router;
