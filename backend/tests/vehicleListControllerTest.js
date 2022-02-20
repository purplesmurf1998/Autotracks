let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let list_id = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Sale Controller Class
describe('Testing Sale Controller Class', () => {
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

  //The below test, checks if we can create a vehicle list successfully
  describe('Create Vehicle List API Test', () => {
    it('should return 201 when a vehicle list is created', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list")
        .send({
            "owner": "61d4e5bb12d6b3b54a70e4dd",
            "dealership": "61eb8ea4caa229aa551cca3c",
            "title": "Test",
            "notes": "testing",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          //We store the list_id that we created so we can delete it later
          list_id = response.body.payload._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we return a vehicle list successfully
  describe('Get Vehicle List API Test', () => {
    it('should return 200 when a vehicle list is returned', (done) => {
      chai.request(app)
        .get("/api/v1/vehicle-list/" + list_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if refuse to return a list given invalid list id
  describe('Get Vehicle List API Error Test', () => {
    it('should return 404 when a vehicle list is not found', (done) => {
      chai.request(app)
        .get("/api/v1/vehicle-list/61f2e3f0156fdedf1c83501c")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

});