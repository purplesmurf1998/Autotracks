let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let comment_id_success = "";
let comment_id_error = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Comments Controller Class
describe('Testing Comments Controller Class', () => {
  //The below test checks if we can sign users/admin in successfully
  describe('Admin/User Sign In API Test', () => {
    it('should return 200 when the admin/user is signed in', (done) => {
      chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
            email,
            password
        })
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          token = response.body.token;
          done();
        });
    });
  });

  //The below test checks if we can create a comment instance successfully
  describe('Create Comment API Test', () => {
    it('should return 201 when a comment is created successfully', (done) => {
      //61de1cb50c6e80e28469d0b4 is a vehicle testing ID
      //61d4e5bb12d6b3b54a70e4dd author is associated with admin@account.com user
      chai.request(app)
        .post("/api/v1/comments/vehicle/61de1cb50c6e80e28469d0b4")
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
            author: '61d4e5bb12d6b3b54a70e4dd',
            comment: 'Test'
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          comment_id_success = response.body.payload._id;
          done();
        });
    });
  });

  //The below test creates a comment instance with a logged out user
  describe('Create Comment API Test with a logged out User', () => {
    it('should return 201 when a comment is created successfully', (done) => {
      //621141a846438d26407b27cc is a vehicle testing ID
      //6209c289e01e1de59e05a0eb author is associated with abd.sirawan@hotmail.com user
      chai.request(app)
        .post("/api/v1/comments/vehicle/61de1cb50c6e80e28469d0b4")
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
            author: '6209c289e01e1de59e05a0eb',
            comment: 'Test'
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          comment_id_error = response.body.payload._id;
          done();
        });
    });
  });

  //The below test checks if we can fetch all comments instances successfully
  describe('Get Comments API Test', () => {
    it('should return 200 when comments are fetched successfully', (done) => {
      //621141a846438d26407b27cc is a vehicle testing ID
      //6209c289e01e1de59e05a0eb author is associated with abd.sirawan@hotmail.com user
      chai.request(app)
        .get("/api/v1/comments/vehicle/61de1cb50c6e80e28469d0b4")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test checks if we can edit a comment instances successfully
  describe('Update Comments API Test', () => {
    it('should return 200 when comment is updated successfully', (done) => {
      chai.request(app)
        .put("/api/v1/comments/comment/" + comment_id_success)
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
            author: '61d4e5bb12d6b3b54a70e4dd',
            comment: 'Test2'
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we refuse to edit a comment if the logged in user isn't the author
  describe('Update Comments API Error Test', () => {
    it('should return 401 because the logged in user is not the author', (done) => {
      chai.request(app)
        .put("/api/v1/comments/comment/" + comment_id_error)
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
            author: '6209c289e01e1de59e05a0eb',
            comment: 'Test2'
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can delete a comment successfully
  describe('Delete Comments API Error Test1', () => {
    it('should return 200 when comment1 is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/comments/comment/" + comment_id_success)
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can delete a comment successfully
  describe('Delete Comments API Test2', () => {
    it('should return 200 when comment2 is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/comments/comment/" + comment_id_error)
        .send({
            vehicle: '61de1cb50c6e80e28469d0b4',
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

});