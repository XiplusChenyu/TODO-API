const expect = require('expect');
const request = require('request');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');


const testTodos = [{
  text:"test1",
  _id: new ObjectID()
}, {
  text:"test2",
  _id: new ObjectID()
}]; // save seed data

beforeEach((done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(testTodos);
  }).then(()=>done()); // chain promise for insertMany
}); // it removes everything, execute before test runs

describe('POST /todos', () =>{
  it('should create a new todo', (done)=>{
    var text = 'TEST TODO TEST';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err, res)=>{
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) =>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

it('should not create todo with invalid body data', (done)=>{
  request(app)
  .post('/todos')
  .send()
  .expect(400)
  .end((err, res) =>{
    if (err) {
      return done(err);
    }
    Todo.find().then((todos) =>{
      expect(todos.length).toBe(2);
      done();
    }).catch((e)=>done(e));
  });
});

});

/*Test for Get*/

describe('GET /todos', ()=>{
  it('should get all todos', (done) =>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {  //return an array
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

/*Test for GET by id*/

describe('GET /todos/:id', ()=>{
  it('should return todo', (done) =>{
    request(app)
    .get(`todos/${testTodos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(testTodos[0].text);
    })
    .end(done);
  });

  it('should return 404 when todo is not found', (done)=>{
    var testid = new ObjectID().toHexString();
    request(app)
    .get(`todos/${testid}`)
    .expect(404)
    .end(done);
  });

  it ('should return 404 when id is invalid', (done)=>{
    request(app)
    .get('todos/happytest')
    .expect(404)
    .end(done);
  });

  
});
