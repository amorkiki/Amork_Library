const express = require("express");
const router = express.Router();
const passport = require("passport");

const Diaries = require("../../models/Diaries");

// $route GET api/diaries/test
// @desc  返回请求的json数据
// @access public
// router.get("/test", (req, res) => {
//   res.json({ msg: "profile works" });
// });

// $route POST api/diaries/add/创建人id/书名
// @desc  添加笔记
// @access private
router.post(
  "/add/:id/:bname/:uname",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const diariesFields = new Diaries();
    diariesFields.creator_id = req.params.id;
    diariesFields.b_name = req.params.bname;
    diariesFields.creator_name = req.params.uname;
    if (req.body.dateAndTime) diariesFields.dateAndTime = req.body.dateAndTime;
    if (req.body.radioWeather)
      diariesFields.radioWeather = req.body.radioWeather;
    if (req.body.b_author) diariesFields.b_author = req.body.b_author;
    if (req.body.b_chapters) diariesFields.b_chapters = req.body.b_chapters;
    if (req.body.content) diariesFields.content = req.body.content;
    if (req.body.intro) diariesFields.intro = req.body.intro;
    diariesFields.save();
    res.json({
      data: diariesFields,
      meta: { success: true, status: 200 },
    });
    // JSON.parse(JSON.stringify(diariesFields))
    
    
  }
);

// $route GET api/diaries/
// @desc 获取所有笔记
// @access private
router.get(
  "/:role/:id",
  passport.authenticate("jwt", { session: false }),
  // (req, res) => {
  //   const pagenum = req.params.pagenum || 1;
  //   const pagesize = req.params.pagesize || 5;
  // },

  (req, res) => {
    let pagenum = req.params.pagenum;
    let pagesize = req.params.pagesize;
    if (req.params.role === "common") {
      Diaries.find({ creator_id: req.params.id }).skip(pagesize * pagenum - pagesize).limit(pagesize)
        .exec((err, diaries) => {
          if (!diaries) {
            return res.json("没找到任何内容呀@_@");
          }
          res.json(JSON.parse(JSON.stringify(diaries)));
          if (err) {
            res.json(err)
          } 
        })
        // .then((diaries) => {
        //   if (!diaries) {
        //     return res.json("没找到任何内容呀@_@");
        //   }
        //   res.json(JSON.parse(JSON.stringify(diaries)));
        // })
        // .catch((err) => res.json(err));
    }
    if (req.params.role === "manager") {
      Diaries.find()
        .then((diaries) => {
          if (!diaries) {
            return res.json("没找到任何内容呀@_@");
          }
          res.json(JSON.parse(JSON.stringify(diaries)));
        })
        .catch((err) => res.json(err));
    }
  }
);
//$route Get api/diaries/:name
// @desc  获取对应书名的笔记
// @access private
router.get(
  "/diaries/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Diaries.find({ b_name: req.params.b_name })
      .then((diaries) => {
        if (!diaries) {
          return res.json("没找到任何内容呀@_@");
        }
        res.json(JSON.parse(JSON.stringify(diaries)));
      })
      .catch((err) => res.json(err));
  }
);

// $route GET api/diaries/find/:value
// @desc  查询信息接口
// @access private
router.get(
  "/find/:value/:query",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.params.value === "1") {
      Diaries.find({ b_name: req.params.query })
        .then((diaries) => {
          if (!diaries) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = diaries;
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
      Diaries.find({ creator_id: req.params.query })
        .then((diaries) => {
          if (!diaries) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = diaries;
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
      Diaries.find({ dateAndTime: req.params.query })
        .then((diaries) => {
          if (!diaries) {
            return res.json("没找到这条内容呀@_@");
          }
          const data = diaries;
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
