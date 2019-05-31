const mongoose = require('mongoose')
const config = require('./config')

module.exports=()=>{
  mongoose.connect(config.mongodb)
  let db = mongoose.connection;
  db.on('error',console.error.bind(console,'connect error.'));
  db.once('open',(callback)=>{
    console.log('MongoDB connect success.')
  })
  return db;
}
