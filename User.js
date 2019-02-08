const mongoose = require('mongoose')
const User = new mongoose.Schema({
  username: String,
  count: Number,
  log : [{ description: String, duration: Number, date: Date }],
},{ usePushEach: true });

module.exports = mongoose.model('User', User);