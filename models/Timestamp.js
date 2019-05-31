var mongoose = require('mongoose');
var timestampSchema = require('../schemas/timestampSchema')

const Timestamp = mongoose.model('timestamp',timestampSchema);
module.exports = Timestamp;
