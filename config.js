require('babel-register');
let conf={
  service:'https://f0c02c8e.ngrok.io/',
  baseTarget:'https://www.newsinlevels.com/',
  mongodb:'mongodb://localhost:27017/engInLevels',
  wechat:{
    "appID":'wxd6a5ee797ec8458e',
    "appSecret":'b97c7fafa28b0561b43409e87a8a24a5',
    "token":"weixin",
    "prefix": "https://api.weixin.qq.com/cgi-bin/",
		"mpPrefix": "https://mp.weixin.qq.com/cgi-bin/"
  },
  youdao:{
    api:'https://openapi.youdao.com/api',
    secreat:'W15MQo5mL5nZuO6ohlx60xtcgj2bdyU3',
    appKey:'79ed69374fd90515',
  }
}

module.exports = conf;
