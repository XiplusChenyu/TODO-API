const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server'); // return stop the function
  }
  const db = client.db('TodoApp'); // client retrieve Database

  console.log('Sucessfully connect Database');

// deleteMany
// target collection
  db.collection('Todos').deleteMany({text: "chenyu"}).then((result) =>{
    console.log(result);
  }).catch((error)=>{console.log(error);});

// Use deleteOne -> only delete the first one which satisfy the requirment
// You can also findOneAndDelete, which is similar with delete one But RETURN WHAT YOU DELETED


}); //where is the db, callback functions
