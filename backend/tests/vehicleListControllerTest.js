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

// The following tests test the entire vehicle list Controller Class
describe('Testing Vehicle List Controller Class', () => {
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

  //The below test, checks if we return a list of vehicle lists successfully
  describe('Get Vehicle Lists API Test', () => {
    it('should return 200 when a list of vehicle lists is returned', (done) => {
      chai.request(app)
        .get("/api/v1/vehicle-list/user/61d4e5bb12d6b3b54a70e4dd")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test, checks if we refuse to return a list given invalid list id
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

  //The below test, checks if we can update vehicle list successfully
  describe('Update Vehicle List API Test', () => {
    it('should return 200 when a vehicle list is updated', (done) => {
      chai.request(app)
        .put("/api/v1/vehicle-list/" + list_id)
        .send({
            "notes": "testing2",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse to update a vehicle list
  describe('Update Vehicle List API Error Test', () => {
    it('should return 404 when a vehicle list is not found', (done) => {
      chai.request(app)
        .put("/api/v1/vehicle-list/61f2e3f0156fdedf1c83501c")
        .send({
            "notes": "testing2",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can add vehicles to the vehicle list
  describe('Add Vehicle to a Vehicle List API Test', () => {
    it('should return 201 when a vehicle is added to a vehicle list', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/" + list_id + "/add")
        .send({
            "vehicles": ["61eb8f67caa229aa551cca9b"],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse adding a vehicle id to an invalid vehicle list id
  describe('Add Vehicle to a Vehicle List API Error Test (Invalid vehicle_list_id)', () => {
    it('should return 404 when a vehicle list is not found', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/61f2e3f0156fdedf1c83501c/add")
        .send({
            "vehicles": ["61eb8f67caa229aa551cca9b"],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse adding an invalid vehicle id to a vehicle list
  describe('Add Vehicle to a Vehicle List API Error Test (Invalid vehicle_id)', () => {
    it('should return 404 when a vehicle id is not found', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/" + list_id + "/add")
        .send({
            "vehicles": ["61eb8f67caa229aa551cca9c"],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse deleting a vehicle id from an invalid vehicle list id
  describe('Delete Vehicle from a Vehicle List API Error Test (Invalid vehicle_list_id)', () => {
    it('should return 404 when a vehicle list is not found', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/61f2e3f0156fdedf1c83501c/delete")
        .send({
            "vehicles": ["61eb8f67caa229aa551cca9b"],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });
  
  //The below test, checks if we can delete vehicles from the vehicle list
  describe('Delete Vehicle from a Vehicle List API Test', () => {
    it('should return 201 when a vehicle is deleted from a vehicle list', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/" + list_id + "/delete")
        .send({
            "vehicles": ["61eb8f67caa229aa551cca9b"],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can delete a list of vehicle lists
  describe('Delete Vehicle Lists API Test', () => {
    it('should return 200 when vehicle lists are deleted', (done) => {
      chai.request(app)
        .post("/api/v1/vehicle-list/user/61d4e5bb12d6b3b54a70e4dd/delete")
        .send({
            "vehicleLists": [list_id],
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });

});