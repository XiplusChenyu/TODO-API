const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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


UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'xichenyu');
  } catch (e) {
    return Promise.reject();
  };

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
// define a middleware before we save the password:

UserSchema.statics.findByPassword = function (email, password) {
  var User = this;
  return User.findOne({email:email}).then((user)=>{
    if (!user) {
      // console.log('no user');
      return Promise.reject(); //jump to catch error

    }
    // console.log('got user');
    return new Promise((resolve, reject) =>{
      bcrypt.compare(password, user.password, (error, result)=>{
        // console.log(result);
        if (result){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });

}

UserSchema.pre('save', function(next) {
  var user = this

  if (user.isModified('password')) { // use is modified to prevent rehash hashed password
    bcrypt.genSalt(10, (error, salt)=>{
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      }); // call next to end;
  });

  } else {
    next();
  }
});


UserSchema.methods.addAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'xichenyu').toString(); // use salt

  user.tokens.push({access, token});
  // user.tokens = user.tokens.concat([{access, token}]); // add it in mongodb
  return user.save().then(() => {
    return token;
  })
};


var User = mongoose.model('User', UserSchema);

module.exports = {User}
