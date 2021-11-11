
let assert = require('assert');

let server = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let dealership_id = "";
const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzY1ODgzODQsImV4cCI6MTYzOTE4MDM4NH0.cv6jonBB44Iu04MKJZ3TcNoneZr7AqfLfNsxDrvzsWE';

// The following tests test the entire Dealership Controller Class
describe('Testing Dealership Controller Class', () => {
  //The below test, checks if we can create a dealership successfully
  describe('Create Dealership API Test', () => {
    it('should return 200 when a dealership is created', (done) => {
      chai.request(server)
        .post("/api/v1/dealerships")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
          "name": "Dealership #1",
          "description": "This is a simple test dealership.",
          "admin": "618aacf45cdc75b8288eb9b5"
        })
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          //We store the dealership_id that we created so we can delete it later
          dealership_id = response.body.payload._id;
          response.body.should.be.a('object');
          response.body.payload.name.should.be.eq("Dealership #1");
          done();
        });
    });
  });

  //The below test checks if we can return a dealership successfully
  describe('Get Dealership API Test', () => {
    it('should return 200 when the dealership is present', (done) => {
      chai.request(server)
        .get("/api/v1/dealerships/" + dealership_id)
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('object');
          response.body.payload._id.should.be.equal(dealership_id);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can return a list of dealership successfully
  describe('Get Dealerships API Test', () => {
    it('should return 200 when it returns dealerships array', (done) => {
      chai.request(server)
        .get("/api/v1/dealerships")
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test, checks if we can update a dealership name successfully
  describe('Update Dealership #1 API Test', () => {
    it('should return 200 when a dealership is created', (done) => {
      chai.request(server)
        .put("/api/v1/dealerships/" + dealership_id)
        //we pass in the new dealership name in the body
        .send({
          "name": "Dealership #2",
        })
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.payload.name.should.be.equal("Dealership #2");
          done();
        });
    });
  });

  //The below test checks if we can delete dealership successfully
  describe('Delete Dealership API Test' + dealership_id, () => {
    it('should return 200 when the dealership is deleted: ' + dealership_id, (done) => {
      chai.request(server)
        .delete("/api/v1/dealerships/" + dealership_id)
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

});

