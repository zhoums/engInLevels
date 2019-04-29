require('babel-register');
var superagent = require('superagent');
var config = require('../config');
let cheerio = require('cheerio');
let mainSpider={
  newsItemURL:[],
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
        self.pages = +$(".pagination").find("li:last-child a").attr('href').split("page")[1].match(/\d+/).toString();
        for(let i=0;i<newsList.length;i++){
          self.newsItemURL=[...self.newsItemURL,newsList.eq(i).find("a").attr('href')];
        }
      }
      console.log('newsItemURL',self.newsItemURL)
      if(self.page<self.pages||self.pages==0){
        self.page++;
        console.log('page',self.page)
        self.fetchNewsItemURL(self.page)
      }
    })
  }
}


module.exports = mainSpider;
