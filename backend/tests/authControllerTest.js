const assert = require('assert');

const chai = require('chai');
const chaiHttp = require('chai-http');
var server = require('../server');
chai.should();
chai.use(chaiHttp);

const email = "admin@account.com";
const password = "password";
let token = "";
let admin_id = "";

// The following tests test the entire Auth Controller Class
describe('Testing Auth Controller Class', () => {
  //The below test checks if we can sign users/admin in successfully
  describe('Admin/User Sign In API Test', () => {
    it('should return 200 when the admin/user is signed in', (done) => {
      chai.request(server)
        .post("/api/v1/auth/signin")
        .send({
          email,
          password
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.payload.email.should.be.eq(email);
          admin_id = response.body.payload._id;
          token = response.body.token;
          done();
        });
    });
    it('should return 400 when no password or email is provided in the body', (done) => {
      chai.request(server)
        .post("/api/v1/auth/signin")
        .send({
          email
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.error.should.be.eq('Please provide an email and password.');
          done();
        });
    });
    it('should return 401 if no user found with provided email', (done) => {
      chai.request(server)
        .post("/api/v1/auth/signin")
        .send({
          email: 'wrongemail@gmail.com',
          password: 'anypassword'
        })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.error.should.be.eq('Invalid credentials.');
          done();
        });
    });
    it('should return 401 if wrong password was given', (done) => {
      chai.request(server)
        .post("/api/v1/auth/signin")
        .send({
          email,
          password: 'wrongpassword'
        })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.error.should.be.eq('Invalid credentials.');
          done();
        });
    });
  });

  //The below test, checks if we can verify the admin/user's token successfully
  describe('Verify Admin/User Token API Test', () => {
    it('should return 200 when the admin/users token is valid', (done) => {
      chai.request(server)
        .post("/api/v1/auth/verify")
        .send({
          token
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });
  //The below test checks if Admin/User can log out successfully
  describe('Admin/User Log Out API Test', () => {
    it('should return 200 when the admin/users is logged out', (done) => {
      chai.request(server)
        .get("/api/v1/auth/logout")
        .set('authorization', 'Bearer ' + token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });
});