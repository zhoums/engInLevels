require('babel-register');
let eventproxy = require('eventproxy');
let cheerio = require('cheerio');
let Article = require('../models/Article')
ep= new eventproxy();



let router = app=>{
  app.get('/', function(req, res, next) {
    let mainSpider = require('../utils/readPage')
    mainSpider.init();
    res.json({a:11})
    // User.find().then(users=>{
    //   res.json(users)
    // })
  });
  app.get('/dailywork', function(req, res, next) {
    let mainSpider = require('../utils/readPage')
    mainSpider.initDailyWork();
    res.json({a:1112})
    // User.find().then(users=>{
    //   res.json(users)
    // })
  });
  app.get('/articles', function(req, res, next) {
    Article.find().sort({"time":-1}).limit(12).then(article=>{
      res.json(article)
    })
  });
  app.get('/todayArticles',(req,res,next)=>{

  })
  app.get('/tenArticles',(req,res,next)=>{

  })
}

module.exports = router;
