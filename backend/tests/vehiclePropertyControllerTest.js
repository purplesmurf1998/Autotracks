let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);
var expect = require('chai').expect

let vehicle_prop_1_id = ''
let vehicle_prop_2_id = ''
let vehicle_prop_1 = {}
let vehicle_prop_2 = {}

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Vehicle Property Controller Class
describe('Testing Vehicle Property Controller Class', () => {

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
          admin_id = response.body.payload._id;
          response.body.should.be.a('object');
          token = response.body.token;
          done();
        });
    });
  });

  //The below test checks if we can create a vehicle property successfully
  describe('Create Vehicle Property API Test', () => {
    it('should return 200 when a vehicle property is created', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties")
        .send({
            'dealership': '618b3bf134f07d9a91c32a1b',
            'label': 'Test1',
            'inputType': 'Text',
            'visible': false
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          vehicle_prop_1_id = response.body.payload._id;
          vehicle_prop_1 = response.body.payload;

          done();
        });
    });
  });

  describe('Create 2nd Vehicle Property API Test', () => {
    it('should return 200 when the 2nd vehicle property is created', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties")
        .send({
            'dealership': '618b3bf134f07d9a91c32a1b',
            'label': 'Test2',
            'inputType': 'Text',
            'visible': false,
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          vehicle_prop_2_id = response.body.payload._id;
          vehicle_prop_2 = response.body.payload;
          done();
        });
    });
  });

  //The below test checks if we can fetch a vehicle property successfully
  describe('Get Vehicle Properties API Test', () => {
    it('should return 200 when vehicle properties are returned', (done) => {
      chai.request(app)
        .get("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          expect(response.body.payload).to.have.lengthOf.above(0);
          done();
        });
    });
  });

  //The below test checks if we can update a vehicle property successfully
  describe('Update Vehicle Property API Test', () => {
    it('should return 200 when a vehicle property is updated', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties/" + vehicle_prop_1_id)
        .set('authorization', 'Bearer ' + token)
        .send({
            'label': 'test_updated'
        })
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          response.body.payload.label.should.be.equal("test_updated");
          done();
        });
    });
  });

  //The below test checks if we return 404 error when the vehicle property id is wrong
  describe('Update Vehicle Property API Error (Wrong ID) Test', () => {
    it('should return 404 because of the wrong vehicle property ID', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties/71a1106490f3350549ffa54e")
        .set('authorization', 'Bearer ' + token)
        .send({
            'label': 'test_updated'
        })
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  //The below test checks if we can update the position of all vehicle properties successfully
  describe('Update Vehicle Property Positions API Test', () => {
    it('should return 200 when vehicle properties positions are updated successfully', (done) => {
        let newProperties = [];
        newProperties.push(vehicle_prop_2);
        newProperties.push(vehicle_prop_1);
        chai.request(app)
        .put("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties")
        .set('authorization', 'Bearer ' + token)
        .send({
            'properties': newProperties
        })
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.payload[0].position.should.be.equal(1)
          response.body.payload[1].position.should.be.equal(2)
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test checks if we return a 404 error when attempting to update vehicle prop position with the wrong ID
  describe('Update Vehicle Property Positions API Test', () => {
    it('should return 404 when vehicle properties positions are updated successfully', (done) => {
        let newProperties = [];
        var vehicle_prop_3 = vehicle_prop_2;
        vehicle_prop_3._id= '71a1106490f3350549ffa54e';
        newProperties.push(vehicle_prop_3);
        newProperties.push(vehicle_prop_1);
        chai.request(app)
        .put("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties")
        .set('authorization', 'Bearer ' + token)
        .send({
            'properties': newProperties
        })
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we can delete a vehicle property successfully
  describe('Delete Vehicle Property API Test', () => {
    it('should return 200 when a vehicle property is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties/" + vehicle_prop_1_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test checks if we can delete a vehicle property successfully
  describe('Delete 2nd Vehicle Property API Test', () => {
    it('should return 200 when a vehicle property is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties/" + vehicle_prop_2_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test checks if we return a 404 error when attempting to delete a nonexistent ID
  describe('Delete Vehicle Property API Error (Wrong ID) Test', () => {
    it('should return 404 when a vehicle property ID does not exist', (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/618b3bf134f07d9a91c32a1b/vehicles/properties/71a1106490f3350549ffa54e")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

});