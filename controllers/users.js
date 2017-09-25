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
      return res.status(500).json({   // Status code 500: Internal Server Error
        error: "Error listing users: " + err
      });
    }

    if (!users) {
      return res.status(404).end();    // Status code 404: Not Found
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
// PUT /users/:id
// Update a user by ID
.put(function(req, res) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {new: true}, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error updating user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
})
// DELETE /users/:id
// Delete a user by ID
.delete(function(req, res) {
    User.remove({
      _id: req.params.id
    }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error deleting user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json({ 
      message: "User successfully deleted"
    });
  })

});


module.exports = router;
