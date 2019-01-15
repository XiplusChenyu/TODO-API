const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server'); // return stop the function
  }
  const db = client.db('TodoApp'); // client retrieve Database

  console.log('Sucessfully connect Database');


  db.collection('Users').findOneAndUpdate({age:25}, {
    $set:{
      age:18
    }
  },
  {returnOriginal: false}).then((updated)=>{
    console.log('Update', JSON.stringify(updated, undefined, 2));

  }, (error)=>{
    console.log('Unable to fetch Users', error);
  }); // this also can be write as a callback function rather than promise

}); //where is the db, callback functions
