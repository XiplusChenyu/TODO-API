var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
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
    res.send(doc); //send back doc as json
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

// router for find individual todo with URL pattern
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
})

app.listen(port, ()=> {
  console.log(`listen ${port}`);
});

module.exports ={app};
