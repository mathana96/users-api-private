var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';


describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      seed(function(err) {
        done(err);
      });
    });
  });

  // Test for /GET route for list of users
  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/testUsers')
        .end(function(err, res) {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  // Test the /GET route for getting a single user
  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/testUsers/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });


  // Test the /POST route for creating a single user
  describe('/POST users', function() {
    it('should create a single user', function(done) {
      // Create a user test-case
      var newUser = {
        "gender": "male",
        "name": {
          "title": "mr",
          "first": "test-first-name",
          "last": "reed"
        },
        "location": {
          "street": "6819 south street",
          "city": "Passage West",
          "state": "massachusetts",
          "zip": 14086
        },
        "email": "hi@email.com",
        "username": "uniqueUsername",
        "password": "uniquePassword",
      };
      chai.request(url)
        .post('/testUsers')
        .send(newUser)
        .end(function(err, res) {
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.name.first).to.be.a('string');
          expect(res.body.name.first).to.equal('test-first-name');
          expect(res.body).to.have.property('gender');
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.have.property('title');
          expect(res.body.name).to.have.property('first');
          expect(res.body.name).to.have.property('last');
          expect(res.body).to.not.have.property('unknown');    // Bogus property
          done();
        });
    });
  });

  // Test the /PUT route for creating a single user
  describe('/PUT users/:id', function() {
    it('should update a single user', function(done) {
      // Get a user from users
      chai.request(url)
        .get('/testUsers')
        .end(function(err, res) {
          // Update the user retrieved 
          chai.request(url)
            .put('/testUsers/' + res.body[0]._id)
            // Properties to be updated
            .send({
              "gender": "updated-gender",
              "name": {
                "title": "updated-title",
                "first": "updated-first-name",
                "last": "test-last-name"
              }
            })
            .end(function(err, res) {
              res.should.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body.gender).to.equal('updated-gender');
              expect(res.body.name.first).to.equal('updated-first-name');
              done();
            });
        });
    });

  });

  // Test the /DELETE route for creating a single user
  describe('/DELETE users/:id', function() {
    it('should delete a single user', function(done) {
      // Get a user from users
      chai.request(url)
        .get('/testUsers')
        .end(function(err, res) {
          // Delete the particular 
          chai.request(url)
            .delete('/testUsers/' + res.body[0]._id)
            .end(function(err, res) {
              res.should.have.status(200);
              expect(res.body).to.be.a('object');
              done();
            });
        });
    });

  });

});
