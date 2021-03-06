var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/auth');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const port = process.env.PORT || 3000; // the or ops allow default

/*Create a app*/
var app = express();

app.use(bodyParser.json());

/*Create post router for this app*/
app.post('/todos', authenticate, (req, res) =>{
  var todo = new Todo({
    text: req.body.text,
    userID: req.user._id,
    recordAt: new Date().getTime()
  });

  todo.save().then((doc)=>{
    res.send(doc); //send back doc as json/
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', authenticate, (req, res) =>{
  // return everything the user create
  Todo.find({
    userID: req.user._id
  }).then((todos) =>{
    res.send({todos});
    // console.log(todos);
  }, (e) =>{
    res.status(400).send(e);
  });
});

// router for find individual todo with URL pattern!
app.get('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id; // get the id in the pattern
  if (!mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    userID: req.user._id
  }).then((todo) =>{
    res.send(todo);
  }).catch((e) =>{
    res.status(400).send();
  });
});

// router for delete todo
app.delete('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id; // get the id in the pattern
  if (!mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    userID: req.user._id
  }).then((todoRemoved) =>{
    if (!todoRemoved){
      return res.status(404).send();
    }
    res.send({todoRemoved});

  }).catch((e) =>{
    res.status(400).send();
  });
});

// router for update todos
app.patch('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id; // get the id in the pattern
  var body = _.pick(req.body, ['text', 'completed']);


  if (!mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt =  null;
  }

  Todo.findOneAndUpdate({_id: id, userID: req.user._id}, {$set:body}, {new: true})
  .then((todo)=>{
    if (!todo){
      return res.status(404).send()
    }
    res.send({todo});
  })
  .catch((e) =>{
    res.status(400).send();
  });
});

// POST/users router:

app.post('/users', (req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body); // just pass the object we created

  user.save().then((user)=>{
    return user.addAuthToken(); // call generate token and update mongoDB!!!
  }).then((token) => {
    res.header('x-auth', token).send(user); //t add a customer x- new header in response body which gives the token
  }).catch((e)=>{res.status(400).send(e)});

});

// get user route:
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// set up route allow user login:
app.post('/users/login', (req, res) =>{
  var {email, password} = _.pick(req.body, ['email', 'password']);
  User.findByPassword(email, password).then((user)=>{
    // res.send(user); //if the password match, we offer token for the client
    return user.addAuthToken().then((token) => {
      res.header('x-auth', token).send(user); //? add a customer x- new header in response body which gives the token
    });
  }).catch((e)=>{
    console.log(e);
    res.status(400).send();
  });
});

// delete token for logined user

app.delete('/users/me/logout', authenticate, (req, res) =>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, () =>{
    res.status(400).send();
  });
});

// middle function:

app.listen(port, ()=> {
  console.log(`listen ${port}`);
});

module.exports = {app};///
