require('babel-register');
let eventproxy = require('eventproxy');
let cheerio = require('cheerio');
let Url = require('url');
let formatJson = require('../utils/formatJson');
let Article = require('../models/Article');
var config = require("../config");
let weChat = require("../utils/weChat");
let youdao = require("../utils/youdao");
var utils = require('../utils/util')

let ep= new eventproxy();
let weChatApp = new weChat(config);

let messageSign=utils.auth(config);

let router = app=>{
  //view templates
  // app.get('/',function(req,res,next){
  //   res.render('index',{"title":"test de"})
  // })

  app.get('/message', function(req,res,next){
    messageSign(req,res,next)
  });
  app.post('/message', function(req,res,next){
    messageSign(req,res,next)
  });


  app.post('/user/login', function(req,res,next){
    res.json({code:20000,msg:"",data:{token:'admin-token'}})
  });
  app.get('/user/info', function(req,res,next){
    res.json({code:20000,msg:"",data:{
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
    })
  });

  app.post('/setmenu',async function(req,res,next){
    console.log('setmenu',req.body)
    let kk=await weChatApp.setMenu(req.body);
    res.send(kk)
  })

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
    Article.find().sort({"time":-1}).limit(12).skip(page*8).exec((err,article)=>{
      if(err){
        res.json(formatJson(err));
        return;
      }
      res.json(formatJson(article));
    })
  });
  app.get('/latestArticles',(req,res,next)=>{
    var params = Url.parse(req.url, true).query;
    let re = new RegExp(".*"+params.title+".*");
    Article.find({time:params.tm,title:re}).exec((err,article)=>{
      if(err){
        console.log(err);
        return;
      }
      article[0].title=params.title;
      let pop=article[0].img.split(".").pop();
      article[0].img=article[0].img.replace("."+pop,"-300x150."+pop);
      article[0].level1=article[0].level1.replace(/<p>You can watch the original video in the Level 3 section.<\/p>/,"")
      article[0].level2=article[0].level2.replace(/<p>You can watch the original video in the Level 3 section.<\/p>/,"")
      article[0].level3=article[0].level3.replace(/<p>You can watch the video news lower on this page.<\/p>/,"")
      res.render("index",article[0])
    })
  })
  app.get('/tenArticles',(req,res,next)=>{

  })
  app.post('/translate',async function(req,res,next){
    let word= req.body.q;
    let translation=await youdao.transtration(word);
    res.json(translation)
  })
}

module.exports = router;
