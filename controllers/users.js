var User = require('../models/user');
var express = require('express');
var router = express.Router();


// Routes that end with /
router.route('/')
// GET /users
// Get a list of users
.get(function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });
})
// POST /users
// Create a new user
.post(function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error creating user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});


// Routes that end with /:id
router.route('/:id')
// GET /users/:id
// Get a user by ID
.get(function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
})

.put(function(req, res) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {new: true}, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);

  });

});


// Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task)

module.exports = router;
