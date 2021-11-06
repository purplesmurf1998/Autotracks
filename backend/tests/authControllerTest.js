let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

const email = "admin@account.com";
const password = "adminpassword";
let token = "";

describe('Testing Auth Controller Class', () => {
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
          admin_id = response.body.payload._id;
          response.body.should.be.a('object');
          token = response.body.token;
          done();
        });
    });
  });

  describe('Verify Admin/User Token API Test', () => {
    it('should return 200 when the admin/users token is valid', (done) => {
      chai.request(app)
        .post("/api/v1/auth/verify")
        .send({
            token
        })
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  describe('Admin/User Log Out API Test', () => {
    it('should return 200 when the admin/users is logged out', (done) => {
      chai.request(app)
        .get("/api/v1/auth/logout")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });
});