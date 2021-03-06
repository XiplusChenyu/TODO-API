var mongoose = require('mongoose');

/** Create a mongoose model and field restricts **/

var Todo = mongoose.model('Todo', {
  text: {
    /*set restrict*/
    type: String, // the mongoose is using cast
    required: true,
    minlength: 1,
    trim: true // .strip() before add
  },
  completed:{
    type: Boolean,
    default: false, // set default
  },
  completedAt:{
    type: Number,
    default: null
  },
  recordAt:{
    type: Number,
    default: null
  },
  userID:{
    type: mongoose.Schema.Types.ObjectId, // the user id is a special type
    required: true
  }
});

module.exports = {Todo};
