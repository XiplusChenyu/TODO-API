var {User} = require('./../models/user');

// Validate User!
var authenticate = (req, res, next) =>{
  var token = req.header('x-auth'); // get the header
  // if findByToken failed, the promise returned is always rejected, so then() call won't fire
  User.findByToken(token).then((user)=>{
    if (!user){
      console.log('no user');
      return Promise.reject(); // jump to catch chain clause.
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(401).send();
  }); //return a 401 status
};

module.exports = {authenticate}
