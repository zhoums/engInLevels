var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var articleSchema = new Schema({
    title:String,
    img:String,
    time:String,
    level1:String,
    level2:String,
    level3:String
},{collection:'article'});
module.exports = articleSchema;
