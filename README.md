# TODO Web app:
- URL: https://afternoon-springs-97331.herokuapp.com/
- not finish yet

# TODO-API
An API for todo app, based on Node.js, using MongoDB to store data


- URL: https://sleepy-inlet-22975.herokuapp.com/
- Test case is partial finished
- Password is hashed before saved in database

## Users:
#### POST /users: 
- This router allows user to create a new user with vaild email address and password, the body should be json with {"email": ,"password":}
- API returns contains x-auth header which is a token for authentication

#### GET /users/me
- This router sends back user's email

#### POST /users/login
- The request body should be json object contains email-password pair
- API returns contains x-auth header which is a token for authentication

#### DELETE /users/me/logout
- The router deleted generated token in database, thus the user must login again to pass the authentication



## Todos:
Need to pass authentication to use the todo functions
#### POST /todos
- Post todos with {text: text} format
- Database record post time and finish time

#### GET /todos
- Return all todos

#### GET/DELETE/PATCH /todos/:id
- Add/delete/modify(mark as completed) for single todo event with certain id
