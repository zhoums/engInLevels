let XMLJS = require('xml2js');
let parser = new XMLJS.Parser();
let builder = new XMLJS.Builder();
var utils={};
var sha1=require('sha1')

//微信客户端各类回调用接口
var EventFunction = {
    //关注
    subscribe: function(result, req, res) {
//存入openid 通过微信的接口获取用户的信息同时存入数据库。
    },
    //注销
    unsubscribe: function(openid, req, res) {
//删除对应id
    },
    //打开某个网页
    VIEW: function() {
//根据需求，处理不同的业务
    },
//自动回复
    responseNews: function(body, res) {
//组装微信需要的json
        var xml  = '<xml>'+
          '<ToUserName><![CDATA['+body.FromUserName+']]></ToUserName>'+
          '<FromUserName><![CDATA['+body.ToUserName+']]></FromUserName>'+
          '<CreateTime>'+ parseInt(new Date().valueOf() / 1000)+'</CreateTime>'+
          '<MsgType><![CDATA[text]]></MsgType>'+
          '<Content><![CDATA[你好]]></Content>'+
        '</xml>';
        
        res.send(xml);
    }
}

utils.sign = function (config){
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
        })
      })
      // next();
    }
  }
}

module.exports = utils;
