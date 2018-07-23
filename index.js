const express = require('express');
const db = require('./data/db.js');

const server = express();
server.use(express.json());

const sendUserError = (status, message, res) => {
  res.status(status).json({errorMessage: message});
  return;
}

server.get('/api/users', (req, res) => {
  db.find().then(response => {
    // console.log(response)
    res.status(200).json(response)
  }).catch(err => {
    // console.log(err);
    res.status(500).json({
      error: "The users information could not be retrieved."
    });
    return;
  });
});

server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id).then(response => {
    console.log('ss', response.length)
    if (response.length > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
      return;
    }
  }).catch(err => {
    console.log("some Other err:", err);
  })
})

server.post('/api/users', (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if (!(req.body.name && req.body.bio)) {
    sendUserError(400, 'Please provide name and bio for the user.', res);
    return;
  } else {
    console.log(req.body);
    db.insert(req.body).then(response => {
      console.log(response);
      res.status(200).json(response);
    }).catch(err => {
      console.log(err);
      sendUserError(500, errr, res);
      return;
    })
  }
});

server.listen(8000, () => console.log('App is listening...'));
