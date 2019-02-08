const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Import the model/schema
const User = require(__dirname + '/User.js');

// add User
app.post('/api/exercise/new-user', (req,res,next)=>{
const username = req.body.username;
  if(username){
  const newUser = {username: username, count: 0, log: []};
    User.findOne({username : newUser.username},(error,data)=>{
    if (error) return next(error);
      if(data){
      res.send('username already taken')
      }else {
      User.create(newUser, (err,user)=>{
      if (error) return next(error);
      res.json({username: user.username, id: user._id})
      })
      }
    })
  }else {
    res.send("You need to provide a username.");
  }
})

app.post('/api/exercise/new-user', (req,res,next)=>{
  const userId = req.body.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  const requiredFieldsCompleted = userId && description && duration;

})




// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
