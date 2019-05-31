var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var userSchema = new Schema({
    name:String,
    age:String,
},{collection:'user'});
module.exports = userSchema;
