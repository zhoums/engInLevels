var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var userSchema = new Schema({
    nickname:String,
    sex:Number,
    city:String,
    province:String,
    country:String,
    headimgurl:String,
    subscribe_time:String,
    subscribe_scene:String,
    openid:String
},{collection:'user'});
module.exports = userSchema;
