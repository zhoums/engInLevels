require('babel-register');
let cheerio = require('cheerio');

let router = app=>{
  app.get('/', function(req, res, next) {
    let mainSpider = require('../utils/readPage')
    mainSpider.fetchNewsItemURL(mainSpider.page);
    res.send('respond with a resource');
  });
  app.get('/users', function(req, res, next) {
    res.send('respond with a resource');
  });
}

module.exports = router;
