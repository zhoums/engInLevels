const service = require('./service');
const fs = require('fs');
let request = require('request');
let accessTokenJson = require('../access_token');
let User = require('../models/User')
var WeChat = function (config){
  const self=this;
  this.config=config;
  this.appID=config.wechat.appID;
  this.secret=config.wechat.appSecret;
  this.baseAPI=config.wechat.prefix;
  this.setMenu=async function(menuObj){
    let a_token= await this.getAccessToken();
    self.post('menu/create?access_token='+a_token,JSON.stringify(menuObj)).then(res=>{
      if(res.errcode){
        return res.errcode+":"+res.errmsg;
      }
      return "success"
    }).catch((err)=>{
      return 'error'
    })
  }
}
WeChat.prototype.getAccessToken=function(){
  const self=this;
  const currentTime= new Date().getTime()/1000;
  if(accessTokenJson.access_token!=""&&accessTokenJson.expires_time>currentTime){
    return accessTokenJson.access_token;
  }
  service.get(self.baseAPI+'token',{
    params:{
      grant_type:'client_credential',
      appid:self.appID,
      secret:self.secret
    }
  }).then(res=>{
    accessTokenJson.access_token = res.access_token;
    accessTokenJson.expires_time = parseInt(new Date().getTime()/1000) + parseInt(res.expires_in);
    fs.writeFile('./access_token.json',JSON.stringify(accessTokenJson),(err)=>{
      if (err) throw err;
      console.log('文件已被保存');
    });
  })
};
WeChat.prototype.get=function(url,params){
  url=`${this.baseAPI}${url}`
  return new Promise((resolve,reject)=>{
    service.get(url,params).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
};
WeChat.prototype.post=function(url,data){
  url=`${this.baseAPI}${url}`
  return new Promise((resolve,reject)=>{
    service.post(url,data).then((res)=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
};
WeChat.prototype.uploadTempMaterial = async function(type,filepath){
  var self = this;
  var form = { //构造表单
    media:fs.createReadStream(filepath)
  }

  let a_token= await this.getAccessToken();
  return new Promise(function(resolve,reject){
    var url = self.baseAPI+'media/upload?access_token=' + a_token + '&type=' + type;
    request({url:url,method:'POST',formData:form,json:true},function(error,response,body){
      if(error){
        console.log('error',error)
        return;
      }
      var _data = response.body;
      if(_data){
        resolve(_data)
      }else{
        throw new Error('upload material failed!');
      }
    })
  });
}
module.exports=WeChat
