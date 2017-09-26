var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var User = mongoose.model('User', {
  gender: String,
  name: Schema.Types.Mixed,
  location: Schema.Types.Mixed,
  email: { type: String, index: true, unique: true, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: String,
  md5: String,
  sha1: String,
  sha256: String,
  registered: Number,
  dob: Number,
  phone: String,
  cell: String,
  PPS: String,
  picture: Schema.Types.Mixed
});

module.exports = User;
