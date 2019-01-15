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

  // db.collection('Todos').find({_id:new ObjectID("5c3d07cc72183803778ecb56")}).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  //
  // }, (error)=>{
  //   console.log('Unable to fetch Notes', error);
  // });
  // client.close();

  db.collection('Users').find().count().then((number)=>{
    console.log('Number', JSON.stringify(number, undefined, 2));

  }, (error)=>{
    console.log('Unable to fetch Users', error);
  }); // this also can be write as a callback function rather than promise

}); //where is the db, callback functions
