const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    minlength: 1,
    required: true,
    unique: true, // make sure this is unique
    validate:{
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }] // define field as an array
});

// we need create instance method and module method here
// override json file:

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}; //toJSON is called by default, thus we only return several info when sending info back

UserSchema.methods.addAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'xichenyu').toString();
  user.tokens.push({access, token});
  // user.tokens = user.tokens.concat([{access, token}]); // add it in mongodb
  return user.save().then(() => {
    return token;
  })
};

UserSchema.statics.findByToken = function () {
  var User = this;
  var decoded;
}




var User = mongoose.model('User', UserSchema);

module.exports = {User}
