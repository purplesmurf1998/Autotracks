let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let vehicle_id = "";

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

  //The below test checks if we can create a vehicle successfully
  describe('Create Vehicle API Test', () => {
    it('should return 201 when a vehicle is created', (done) => {
      chai.request(app)
        .post("/api/v1/inventory")
        //We need to send in the dealership id because we cannot create a vehicle without a dealership
        .send({
            'dealership': '618b3bf134f07d9a91c32a1b',
            'properties': {
              'test1': 'testing',
            },
            'vin': '1G1PF5SC1C7142797'
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          vehicle_id = response.body.payload._id;
          done();
        });
    });
  });

  //The below test refuses to create a vehicle because of invalid dealership ID
  describe('Create Vehicle API Error Test (Invalid dealership_id)', () => {
    it('should return 400 because vehicle is not created', (done) => {
      chai.request(app)
        .post("/api/v1/inventory")
        //The dealership ID is invalid, hence the error.
        .send({
            'dealership': '618b3bf134f07d9a91c32a1c',
            'properties': {
                'test1': 'testing',
              }
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(400);
          response.body.success.should.be.false;
          done();
        });
    });
  });

  //The below test checks if we can return a list of vehicles successfully
  describe('Get Vehicles API Test', () => {
    it('should return 200 when vehicles are returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1b")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test refuses to return a list vehicles because of invalid dealership ID
  describe('Get Vehicles API Error Test (invalid dealership_id)', () => {
    it('should return 404 when vehicles are not returned', (done) => {
      chai.request(app)
        //invalid dealership ID in the get request
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1c")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.success.should.be.false;
          done();
        });
    });
  });

  //The below test checks if we can return a vehicle successfully
  describe('Get Vehicle API Test', () => {
    it('should return 200 when a vehicle is returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/vehicle/" + vehicle_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('object');
          done();
        });
    });
  });

  //The below test refuses to return a vehicle because of invalid vehicle_id
  describe('Get Vehicle API Error Test (Invalid vehicle_id)', () => {
    it('should return 404 because vehicle_id is invalid', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/vehicle/61d140fe1813f5b6f78b087c")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.success.should.be.false;
          done();
        });
    });
  });

  //The below test checks if we can return the vehicles by property for dashboard visual 3
  describe('Get Vehicles by Porperties Dashboard v3 API Test', () => {
    it('should return 200 when a vehicles by properties is returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1b/visual3/test1")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          done();
        });
    });
  });

  //The below test checks if we refuse to return vehicles by property dashboard visual 3
  describe('Get Vehicles by Porperties Dashboard v3 API Error Test (invalid dealership_id)', () => {
    it('should return 400 because of invalid dealership_id', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1c/visual3/test1")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          //the response data should be an array of users
          done();
        });
    });
  });

  //The below test checks if we can return the vehicles that are not sold
  describe('Get Vehicles that are Not Sold API Test', () => {
    it('should return 200 when vehicles that are not sold are returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1b/notSold")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          done();
        });
    });
  });

  //The below test checks if we can return the vehicles that are not sold
  describe('Get Vehicles that are Not Sold API Error Test (invalid dealership_id)', () => {
    it('should return 404 because of invalid dealership_id', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/dealership/618b3bf134f07d9a91c32a1c/notSold")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          //the response data should be an array of users
          done();
        });
    });
  });

  //The below test checks if we can update a vehicle successfully
  describe('Update Vehicle API Test', () => {
    it('should return 200 when a vehicle is updated', (done) => {
      chai.request(app)
        .put("/api/v1/inventory/vehicle/" + vehicle_id)
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

  //The below test refuses to update a vehicle due to invalid vehicle_id
  describe('Update Vehicle API Error Test (Invalid vehicle_id)', () => {
    it('should return 404 because vehicle was not updated', (done) => {
      chai.request(app)
        .put("/api/v1/inventory/vehicle/61d140fe1813f5b6f78b087c")
        .set('authorization', 'Bearer ' + token)
        .send({
            "deposit": 500,
          })
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.success.should.be.false;
          done();
        });
    });
  });

  //The below test checks if we can delete a vehicle successfully
  describe('Delete Vehicle API Test', () => {
    it('should return 200 when a vehicle is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/inventory/vehicle/" + vehicle_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });

  //The below test refuses to delete a vehicle because of invalid vehicle_id
  describe('Delete Vehicle API Error Test (Invalid vehicle_id)', () => {
    it('should return 404 when a vehicle is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/inventory/vehicle/61de1cb50c6e80e28479d1b4")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.success.should.be.false;
          done();
        });
    });
  });

});
