require('babel-register');
var superagent = require('superagent');
var config = require('../config');
let fs= require('fs');
let path =require('path');
let cheerio = require('cheerio');
let eventproxy = require('eventproxy');

let ep=new eventproxy();

ep.all('pageList',function(pageList){
  pageList.forEach((url,key)=>{
    superagent.get(url).end((err,newItem)=>{
      if(err){
        console.log("fetch news error:",err);
        return;
      }
      let $=cheerio.load(newItem.text),
          wrap=$(".article-upper"),
          title = wrap.find(".article-title").text(),
          img = wrap.find(".img-wrap a").attr("href"),
          content =wrap.find("#nContent").html();
          console.log('title:',title,content)
    })
  })
})



let mainSpider={
  // newsItemURL:[],
  page:1,
  pages:0,
  fetchNewsItemURL:function(page){
    const self=this;
    superagent.get(`${config.baseTarget}page/${page}/`).end((err,res)=>{
      if(err){
        console.log("error:",err);
      }else{
        console.log('fetching page '+page)
        let $=cheerio.load(res.text),
            newsWrap=$(".recent-news"),
            newsList=newsWrap.find(".news-block");
        let list=[];
        self.pages = +$(".pagination").find("li:last-child a").attr('href').split("page")[1].match(/\d+/).toString();
        for(let i=0;i<newsList.length;i++){
          list=[...list,newsList.eq(i).find("a").attr('href')];
        }
        ep.emit('pageList',list)
      }
      console.log('newsItemURL',self.newsItemURL)
      // if(self.page<self.pages||self.pages==0){
      //   self.page++;
      //   console.log('page',self.page)
      //   self.fetchNewsItemURL(self.page)
      // }
    })
  }
}


module.exports = mainSpider;
