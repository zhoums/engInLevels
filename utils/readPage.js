require('babel-register');
var superagent = require('superagent');
var config = require('../config');
// let fs= require('fs');
// let path =require('path');
let cheerio = require('cheerio');
let eventproxy = require('eventproxy');
let Article = require('../models/Article')
let Timestamp = require('../models/Timestamp')
let i=0;//have how mush item


let ep=new eventproxy();
let latestTimestamp,earlyTimestamp;

let mainSpider={
  page:1,
  pages:0,
  dailyWork:false,
  article:[],
  fetchNewsItemURL:async function(page=1,isDalyWork=false){
    const self=this;
    //取列表时，timestamp是不会变的，这里只取一次就可以对比
    let timestamp = await Timestamp.find({}).sort({"flag":-1});
    latestTimestamp = timestamp[0]?timestamp[0].timestamp:0;
    earlyTimestamp = timestamp[1]?timestamp[1].timestamp:9999999999;
    self.dailyWork=isDalyWork;
    console.log('page',page)
    superagent.get(`${config.baseTarget}page/${page}/`).end(async (err,res)=>{
      if(err){
        console.log("error:",err);
      }else{
        let $=cheerio.load(res.text),
            newsWrap=$(".recent-news"),
            newsList=newsWrap.find(".news-block");
        let list=[];
        self.pages =self.pages==0?+$(".pagination").find("li:last-child a").attr('href').split("page")[1].match(/\d+/).toString():self.pages;// +:{change string to int}
        for(let i=0;i<newsList.length;i++){
          let hrefList=[],
              timeHtml=newsList.eq(i).find(".news-block-right .news-excerpt p").text(),
              time= timeHtml?timeHtml.split(" ")[0]:"",
              itemHref=newsList.eq(i).find(".news-block-right li");
          time=time.split("-").reverse().join("-");
          time=time==""?time:new Date(time).getTime()/1000;
          for(let k =0 ;k<itemHref.length;k++){
            if(time!=""&&(time>latestTimestamp||time<earlyTimestamp)){
              hrefList.push(itemHref.eq(k).find('a').attr('href'))
            }
          }
          list=[...list,...hrefList];
        }
        ep.emit('pageList',list)
      }
    })
  },
  reset(){
    this.page=1;
    this.pages=0;
    this.dailyWork=false;
    this.article=[];
  },
  init(){
    console.time('fteching')
    this.fetchNewsItemURL();
  },
  initDailyWork(){
    console.time('fteching')
    this.fetchNewsItemURL(1,true);
  }
}

ep.tail('pageList',async function(pageList){
  let title="",img="",time="",level=['','',''];
  let listIndex=0;

  function getContent(url,key){
    let mod=key%3
    superagent.get(url).end(async (err,newItem)=>{
      if(err){
        console.log("fetch news error:",err);
        return;
      }
      let $=cheerio.load(newItem.text),
          wrap=$(".article-upper");
      let timestamp;
      //这里的timestamp每次都有可能改变，需要每次都读取。
      timestamp = await Timestamp.find({}).sort({"flag":-1});
      if(mod==0){
        title="";
        img="";
        time="";
        level=['','',''];
        latestTimestamp = timestamp[0]?timestamp[0].timestamp:0;
        earlyTimestamp = timestamp[1]?timestamp[1].timestamp:9999999999;
      }

      time = wrap.find('#nContent p').eq(0).text();
      let _time = time.split(" ");
      time = _time[0].split("-").reverse().join("-");
      time = new Date(time).getTime()/1000;

      title = wrap.find(".article-title").text().trim();
      let new_con= wrap.find("#nContent").html().replace(/<p>You can watch the video news lower on this page.<\/p>/,"").replace(/<p>You can watch the original video in the Level 3 section.<\/p>/,"")
      level[mod] = new_con.trim();
      img = wrap.find(".img-wrap a").attr("href");

      if(mod==2){
        Article.create({title,img,time,level1:level[0],level2:level[1],level3:level[2]},async (error,article)=>{
          if(error){
            console.log('error',error)
          }else{
            if(latestTimestamp<time){
              await Timestamp.update({flag:1},{timestamp:time},{upsert:true})
            }else if(earlyTimestamp>time){
              await Timestamp.update({flag:0},{timestamp:time},{upsert:true})
            }else{
              console.log('not lastest article')
            }
            i++;
            console.log('success',i)
          }
          if(key<pageList.length-1){
            listIndex++;
            getContent(pageList[listIndex],listIndex)
          }
          if(key==pageList.length-1){
            listIndex=0;
            ep.emit('finishOnePage')
          }
        })
      }else{
        listIndex++;
        getContent(pageList[listIndex],listIndex)
      }

    })
  }
  if(pageList.length==0){
    ep.emit('finishOnePage')
  }else{
    getContent(pageList[listIndex],listIndex)
  }

})

ep.tail("finishOnePage",(finishOnePage)=>{
  let pages= mainSpider.dailyWork?10:mainSpider.pages;
  if(mainSpider.page<pages||mainSpider.pages==0){
    mainSpider.page++;
    mainSpider.fetchNewsItemURL(mainSpider.page,mainSpider.dailyWork)
  }else{
    mainSpider.reset();
    console.log('======== end ==========')
    console.timeEnd('fteching')
  }
})

module.exports = mainSpider;
