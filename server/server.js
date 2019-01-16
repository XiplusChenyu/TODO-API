var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const port = process.env.PORT || 3000; // the or ops allow default

/*Create a app*/
var app = express();

app.use(bodyParser.json());

/*Create post router for this app*/
app.post('/todos', (req, res) =>{
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc); //send back doc as json/
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', (req, res) =>{
  // return everything
  Todo.find().then((todos) =>{
    res.send({todos});
    // console.log(todos);
  }, (e) =>{
    res.status(400).send(e);
  });
});

// router for find individual todo with URL pattern!
app.get('/todos/:id', (req, res)=>{
  var id = req.params.id; // get the id in the pattern
  if (!mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) =>{
    res.send(todo);
  }).catch((e) =>{
    res.status(400).send();
  });
});

// router for delete todo
app.delete('/todos/:id', (req, res)=>{
  var id = req.params.id; // get the id in the pattern
  if (!mongodb.ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todoRemoved) =>{
    if (!todoRemoved){
      return res.status(404).send();
    }
    res.send({todoRemoved});

  }).catch((e) =>{
    res.status(400).send();
  });
});

// router for update todos
app.patch('/todos/:id', (req, res)=>{
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

  Todo.findByIdAndUpdate(id, {$set:body}, {new: true})
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
    return user.addAuthToken(); // ! call generate token and update mongoDB!!!
  }).then((token) => {
    res.header('x-auth', token).send(user); //? add a customer x- new header in response body which gives the token
  }).catch((e)=>{res.status(400).send(e)});

});

// Validate User

app.get('users/me', (req, res)=>{
  var token = req.header('x-auth'); // get the header
})


app.listen(port, ()=> {
  console.log(`listen ${port}`);
});

module.exports = {app};///
