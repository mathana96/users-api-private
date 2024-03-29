var User = require('../models/user');
var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var check = require('express-validator/check').check;
var validationResult = require('express-validator/check').validationResult;
var validateId = require('mongoose').Types.ObjectId.isValid;

// Utility function for string validation
function stringsValidators(strings) {
  return strings.map(function(str) {
    return check(str).exists().trim().isLength({ min: 1 });
  });
}

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

    res.render('pages/listUsers', { users: users })
  });
})
// POST /users
// Create a new user
.post(
  stringsValidators(['gender','name.*','username','password','location.*']) // Must be a string and exist
  .concat(check('email').isEmail().withMessage('must be an email'))
  , function(req, res) {
    var newUser = new User(req.body);
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    if (newUser.username && newUser.password)
    newUser.save(function(err, user) {
      if (err) {
        return res.status(500).json({
          error: "Error creating user: " + err
        });
      }

      if (!user) {
        return res.status(404).end();
      }

      res.render('pages/createUser', { user: user });
    });
  });


// Routes that end with /:id  
router.route('/:id')
// GET /users/:id
// Get a user by ID
.get(function(req, res) {
  if(!validateId(req.params.id)) {
    return res.status(422).end();
  }
  
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

    res.render('pages/getUser', { user: user });

  });
})
// PUT /users/:id
// Update a user by ID
.put(function(req, res) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, req.body, { new: true, runValidators: true, context: 'query' }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error updating user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.render('pages/index');
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

    res.render('pages/index');
  })

});


module.exports = router;
