var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var path = require('path');
var marked = require('marked');
var fs = require('fs');
var logger = require('winston');
var userController = require('./controllers/users');
var testUserController = require('./controllers/testUsers');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 8000)); // Binding port

// Add middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  return res.render('pages/index');
});

app.get('/createUser', function(req, res) {
  return res.render('pages/createUserForm');
});

app.get('/docs', function(req, res) {
  var md = function(filename) {
    var path = __dirname + "/" + filename;
    var include = fs.readFileSync(path, 'utf8');
    var html = marked(include);

    return html;
  };

  return res.render('pages/api', {
    "md": md
  });
});

// See the User Controller for `/users` and `/testUsers` routes
app.use('/users', userController);
app.use('/testUsers', testUserController);


// Some switches for acceptance tests
if (require.main === module) {
  // Only connect to MongoDB if app.js is run
  // If require'd (e.g. in tests), let these tests establish a DB connection themselves

  if (process.env.DBUSER && process.env.DBPASSWORD) {
    mongoose.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@ds151544.mlab.com:51544/usersapi'); // For Heroku
  } else {
    mongoose.connect('mongodb://localhost/users'); // For running locally
  }

  // Only listen when app.js is run - acceptance tests will listen on another port
  app.listen(app.get('port'), function() {
    logger.info('Node app is running at', app.get('port'));
  });
}

module.exports = app;
