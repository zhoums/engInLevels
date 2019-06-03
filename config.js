require('babel-register');
let conf={
  baseTarget:'https://www.newsinlevels.com/',
  mongodb:'mongodb://localhost:27017/engInLevels',
  wechat:{
    "appID":'wxd6a5ee797ec8458e',
    "appSecret":'b97c7fafa28b0561b43409e87a8a24a5',
    "token":"weixin",
    "prefix": "https://api.weixin.qq.com/cgi-bin/",
		"mpPrefix": "https://mp.weixin.qq.com/cgi-bin/"
  }
}

module.exports = conf;
