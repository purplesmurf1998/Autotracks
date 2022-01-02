let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let vehicle_id = "";
let user_id = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";
// The following tests test the entire User Controller Class
describe('Testing Vehicle Controller Class', () => {

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

  //The below test, checks if we can create a vehicle successfully
  describe('Create Vehicle API Test', () => {
    it('should return 200 when a vehicle is created', (done) => {
      chai.request(app)
        .post("/api/v1/inventory")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
            'dealership': '618b3bf134f07d9a91c32a1b',
            'properties': {
              'test1': 'testing',
            }
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          vehicle_id = response.body.payload._id;
          done();
        });
    });
  });

  //The below test, checks if we can return a list of vehicles successfully
  describe('Get Vehicles API Test', () => {
    it('should return 200 when vehicles are returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1b")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test, checks if we can return a vehicle successfully
  describe('Get Vehicle API Test', () => {
    it('should return 200 when a vehicle is returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/vehicle/" + vehicle_id)
        //We need to send in the admin id because we cannot create a dealership without an admin
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can update a vehicle successfully
  describe('Update Vehicle API Test', () => {
    it('should return 200 when a vehicle is updated', (done) => {
      chai.request(app)
        .put("/api/v1/inventory/vehicle/" + vehicle_id)
        //We need to send in the admin id because we cannot create a dealership without an admin
        .set('authorization', 'Bearer ' + token)
        .send({
            "deposit": 500,
          })
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can delete a vehicle successfully
  describe('Delete Vehicle API Test', () => {
    it('should return 200 when a vehicle is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/inventory/vehicle/" + vehicle_id)
        //We need to send in the admin id because we cannot create a dealership without an admin
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });

});
