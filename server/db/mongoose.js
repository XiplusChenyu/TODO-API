/** connection **/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //use the build-in promise
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/TodoApp'); // the connection is blocked

module.exports = {mongoose};
