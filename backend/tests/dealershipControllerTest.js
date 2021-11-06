
let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let dealership_id = "";

describe('Testing Dealership Controller Class', () => {
  describe('Create Dealership API Test', () => {
    it('should return 201 when a dealership is created', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships")
        .send({
            "name": "Dealership #1",
            "description": "This is a simple test dealership.",
            "admin": "6176c48f825fbc6aac712b62"
        })
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(201);
          dealership_id = response.body.dealership._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

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

  describe('Get Dealerships API Test', () => {
    it('should return 200 when it returns dealerships array', (done) => {
      chai.request(app)
        .get("/api/v1/dealerships")
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  describe('Update Dealership#1 API Test', () => {
    it('should return 200 when a dealership is created', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/" + dealership_id)
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
  
