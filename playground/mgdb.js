const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server'); // return stop the function
  }
  const db = client.db('TodoApp'); // client retrieve Database

  console.log('Sucessfully connect Database');
  // db.collection('Todos').insertOne({
  //   text: 'Todo',
  //   completed: false
  // }, (err, result) =>{
  //   if(err){
  //     return console.log("Insert Failed", err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })
  db.collection('Users').insertOne({
    text: 'Chenyu',
    age: 25,
    location:'NYC'
  }, (err, result) =>{
    if(err){
      return console.log("Insert Failed", err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  })

  client.close();

}); //where is the db, callback functions
