let XMLJS = require('xml2js');
const path = require('path');
const WeChat = require('./weChat');
let parser = new XMLJS.Parser();
let builder = new XMLJS.Builder();
const config = require('../config')
let User = require('../models/User')
let formatJson = require('./formatJson')
let Articles = require('../models/Article')
var sha1=require('sha1')

let wechat= new WeChat(config)

var utils={};

//微信客户端各类回调用接口
var EventFunction = {
    //关注
    subscribe: async function(body, res, text) {
      //存入openid 通过微信的接口获取用户的信息同时存入数据库。
      const openid = body.FromUserName[0];
      const token = await wechat.getAccessToken();
      wechat.get(`user/info?access_token=${token}&openid=${openid}&lang=zh_CN`).then(res=>{
        let {nickname,sex,city,province,country,headimgurl,subscribe_time,subscribe_scene,openid} = res
        User.create({nickname,sex,city,province,country,headimgurl,subscribe_time,subscribe_scene,openid},(error,user)=>{
          if(error){
            console.log('create user error',error);
            return;
          }
        })
      }).catch(err=>{
        console.log('create user faile,openid:',openid)
      })
      var xml  = '<xml>'+
        '<ToUserName><![CDATA['+body.FromUserName+']]></ToUserName>'+
        '<FromUserName><![CDATA['+body.ToUserName+']]></FromUserName>'+
        '<CreateTime>'+ parseInt(new Date().valueOf() / 1000)+'</CreateTime>'+
        '<MsgType><![CDATA[text]]></MsgType>'+
        '<Content><![CDATA['+text+']]></Content>'+
        '</xml>';

      res.send(xml);
    },
    //注销
    unsubscribe: async function(body, res) {
//删除对应id
      const openid = body.FromUserName[0];
      const token = await wechat.getAccessToken();
      User.remove({'openid':openid},error=>{
        if (error) {
           console.log("Error:" + err);
       }
      })
    },
    //打开某个网页
    VIEW: function() {
//根据需求，处理不同的业务
    },
//自动回复
    responseNews: function(body, res, text) {
      text=text||'default'
//组装微信需要的json
        var xml  = '<xml>'+
          '<ToUserName><![CDATA['+body.FromUserName+']]></ToUserName>'+
          '<FromUserName><![CDATA['+body.ToUserName+']]></FromUserName>'+
          '<CreateTime>'+ parseInt(new Date().valueOf() / 1000)+'</CreateTime>'+
          '<MsgType><![CDATA[text]]></MsgType>'+
          '<Content><![CDATA['+text+']]></Content>'+
        '</xml>';
        res.send(xml);
    }
}

utils.auth = function (config){
  const self = this;
  return function(req,res,next){
    config= config||{};
    var q = req.query;
    var token = config.wechat.token;
    var signature = q.signature;
    var nonce= q.nonce;
    var timestamp = q.timestamp;
    var echostr =q.echostr;

    var str= [token,nonce,timestamp].sort().join("");
    var sha = sha1(str);

    if(req.method=='GET'){
      if(sha==signature){
        res.send(echostr+"")
      }else{
        res.send("err")
      }
    }else if(req.method=="POST"){
      if(sha!=signature){
        return;
      }
      req.on("data",(data)=>{
        parser.parseString(data.toString(),(err,result)=>{
          let body=result.xml;
          let messageType= body.MsgType[0];

          if(messageType=='text'){
            EventFunction.responseNews(body, res);
          }
          if(messageType=='event'){
            //关注
            if(body.Event[0]=='subscribe'){
              EventFunction.subscribe(body, res,'Welcome subscribe english_in_levels. In english_in_levels,you can improver your english very fast.let\'s begin!');
            }
            if(body.Event[0]=='unsubscribe'){
              EventFunction.unsubscribe(body,res);
              res.send("success")
            }
            if(body.Event[0]=="CLICK"){
              if(/^V1001/.test(body.EventKey[0])){
                let lim = body.EventKey[0]=="V1001_THE_NEWS"?3:8;
                Articles.find({}).sort({time:-1}).limit(lim).exec(async (error,articles)=>{
                  if(error){
                    console.log("error:",error)
                    return;
                  }
                  let title,img,time,art,url;
                  let xml  = '<xml>'+
                    '<ToUserName><![CDATA['+body.FromUserName+']]></ToUserName>'+
                    '<FromUserName><![CDATA['+body.ToUserName+']]></FromUserName>'+
                    '<CreateTime>'+ parseInt(new Date().valueOf() / 1000)+'</CreateTime>'+
                    '<MsgType><![CDATA[news]]></MsgType>'+
                    '<ArticleCount>'+lim+'</ArticleCount>'+
                    '<Articles>';

                  articles.forEach((item,key)=>{
                      title = (item.title.trim()).split("–");
                      title.pop();
                      title = title.length>1?title.join(" - "):title;
                      img = item.img.trim();
                      if(key>0){
                        let pop = img.split(".").pop()
                        img = img.replace("."+pop,"-200x100."+pop);
                      }
                      console.log('imgg',img)
                      art = self.replaceHTML(item.level1.trim());
                      time = item.time;
                      url = `${config.service}latestArticles?tm=${time}&title=${title}`
                      let _xml ='<item>'+
                      '<Title><![CDATA['+title+']]></Title>'+
                      '<Description><![CDATA['+art+']]></Description>'+
                      '<PicUrl><![CDATA['+img+']]></PicUrl>'+
                      '<Url><![CDATA['+url+']]></Url>'+
                      '</item>'
                      xml+=_xml;
                  })
                  xml+='</Articles></xml>';
                  res.send(xml);
                });
              }else if(body.EventKey[0]=='V1002_ALL_NEWS'){

              }
            }
          }
        })
      })
      // next();
    }
  }
}


utils.replaceHTML = function(str){
    return str.replace(/<[^>]*>/gi,"");
}

utils.formatJson = formatJson;


module.exports = utils;
