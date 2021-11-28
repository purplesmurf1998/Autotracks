
let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let dealership_id = "";

// The following tests test the entire Dealership Controller Class
describe('Testing Dealership Controller Class', () => {
//The below test, checks if we can create a dealership successfully
  describe('Create Dealership API Test', () => {
    it('should return 201 when a dealership is created', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
            "name": "Dealership #1",
            "description": "This is a simple test dealership.",
            "admin": "618aacf45cdc75b8288eb9b5"
        })
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(201);
          //We store the dealership_id that we created so we can delete it later
          dealership_id = response.body.dealership._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can return a dealership successfully
  describe('Get Dealership API Test', () => {
    it('should return 200 when the dealership is present: ' + dealership_id, (done) => {
      chai.request(app)
        .get("/api/v1/dealerships/" + dealership_id)
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('object');
          response.body.data._id.should.be.equal(dealership_id);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can return a list of dealership successfully
  describe('Get Dealerships API Test', () => {
    it('should return 200 when it returns dealerships array', (done) => {
      chai.request(app)
        .get("/api/v1/dealerships")
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test, checks if we can update a dealership name successfully
  describe('Update Dealership#1 API Test', () => {
    it('should return 200 when a dealership is created', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/" + dealership_id)
        //we pass in the new dealership name in the body
        .send({
            "name": "Dealership #2",
        })
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.data.name.should.be.equal("Dealership #2");
          done();
        });
    });
  });
  
  //The below test checks if we can delete dealership successfully
  describe('Delete Dealership API Test' + dealership_id, () => {
    it('should return 200 when the dealership is deleted: ' + dealership_id, (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/" + dealership_id)
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

});
  
