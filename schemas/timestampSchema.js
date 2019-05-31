var mongoose = require('mongoose');
var schema = mongoose.Schema;
//创建Schema
var timestampSchema = new schema({
    timestamp:String,
    flag:String
},{collection:'timestamp'});
module.exports = timestampSchema;
