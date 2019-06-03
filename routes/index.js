require('babel-register');
let eventproxy = require('eventproxy');
let cheerio = require('cheerio');
let formatJson = require('../utils/formatJson');
let Article = require('../models/Article');
var config = require("../config");
var utils = require('../utils/util')
let ep= new eventproxy();

let messageSign=utils.sign(config);

let router = app=>{
  app.get('/message', messageSign);
  app.post('/message', messageSign);


  app.get('/dailywork', function(req, res, next) {
    console.log(req.header)
    let mainSpider = require('../utils/readPage')
    mainSpider.initDailyWork();
    res.json({a:1112})
    // User.find().then(users=>{
    //   res.json(users)
    // })
  });
  app.get('/articles/:page', function(req, res, next) {
    var page=req.params.page-1;
    page=page<0?0:page
    Article.find().sort({"time":-1}).limit(12).skip(page*12).exec((err,article)=>{
      if(err){
        res.json(formatJson(err));
        return;
      }
      res.json(formatJson(article));
    })
  });
  app.get('/todayArticles',(req,res,next)=>{

  })
  app.get('/tenArticles',(req,res,next)=>{

  })
}

module.exports = router;
