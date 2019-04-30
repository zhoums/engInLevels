let mongoose = require('mongoose');
let db = mongoose.createConnection('localhost','admin');

db.on("error",function(error){
  console.log(error);
})

let Schema = mongoose.Schema;
let userSchema = new Schema({
    name:{type:String}
})

exports.userSchema=db.model('admin',userSchema);
exports.db=db;
