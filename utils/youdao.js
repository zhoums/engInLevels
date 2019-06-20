let config = require('../config')
let service = require('./service')
const sha256=require('js-sha256')

let fanyi={
  api:config.youdao.api,
  sign:function(text,now,curtime){
    let input = text.length<=20?text:text.substring(0,10)+text.length+text.substring(text.length-10);
    let sha = `${config.youdao.appKey}${input}${now}${curtime}${config.youdao.secreat}`;
    return sha256(sha)
  },
  transtration:function(q){
    const self= this;
    let now=new Date().getTime()
    let curtime= Math.round(now/1000);
    let param= {
      q,
      appKey:config.youdao.appKey,
      salt:`${now}`,
      from:'auto',
      to:"zh-CHS",
      curtime:`${curtime}`,
      sign:this.sign(q,now,curtime),
      signType:'v3',
    }
    return new Promise((resolve,reject)=>{
      service.get(self.api,{params:param}).then(res=>{
        resolve(res)
      }).catch(err=>{
        reject(err)
      })
    })

  },
}
module.exports = fanyi;
