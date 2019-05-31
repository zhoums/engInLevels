const mongoose = require('mongoose');
let userSchema = require('../schemas/userSchema');

let User = mongoose.model('user',userSchema);
module.exports = User;
