
let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let user_id = "";

describe('Create User Test', () => {
  describe('Create User API', () => {
    it('should return 200 when the user is not present', (done) => {
      chai.request(app)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "Abdul1",
          "last_name": "Sir1",
          "email": "Abdul1@gmail.com",
          "role": "Administration",
          "password": "password123"
        })
        .end( (err, response) => {
          response.should.have.status(200);
          user_id = response.body.payload._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });
});

describe('Get User Test', () => {
  describe('Get User API', () => {
    it('should return 200 when the user is present: ' + user_id, (done) => {
      chai.request(app)
        .get("/api/v1/users/" + user_id)
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('object');
          response.body.should.be.a('object');
          done();
        });
    });
  });
});

describe("Delete User Test", () => {
  describe('Delete User API' + user_id, () => {
    it('should return 200 when the user is deleted: ' + user_id, (done) => {
      chai.request(app)
        .delete("/api/v1/users/" + user_id)
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});