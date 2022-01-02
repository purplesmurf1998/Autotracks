let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let dealership_id = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Dealership Controller Class
describe('Testing Dealership Controller Class', () => {
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
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          //We store the dealership_id that we created so we can delete it later
          dealership_id = response.body.dealership._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we return 400 error when an admin is not attached to a dealership
  describe('Create Dealership API Error Test (No Admin ID)', () => {
    it('should return 400 because admin is not attached to a dealership', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
            "name": "Dealership #1",
            "description": "This is a simple test dealership.",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  //The below test, checks if we return 404 error when an admin id is nonexistent
  describe('Create Dealership API Error Test (Wrong Admin ID)', () => {
    it('should return 404 because admin ID does not exist', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
            "name": "Dealership #1",
            "description": "This is a simple test dealership.",
            "admin": "718aacf45cdc75b8288eb9b5"
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  //The below test, checks if we return 400 error when an user id is not an admin
  describe('Create Dealership API Error Test (User ID not Admin)', () => {
    it('should return 400 because admin ID does not exist', (done) => {
      chai.request(app)
        .post("/api/v1/dealerships")
        //We need to send in the admin id because we cannot create a dealership without an admin
        .send({
            "name": "Dealership #1",
            "description": "This is a simple test dealership.",
            "admin": "6192c675d871bef9ad3887d1"
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  //The below test checks if we can return a dealership successfully
  describe('Get Dealership API Test', () => {
    it('should return 200 when the dealership is present: ' + dealership_id, (done) => {
      chai.request(app)
        .get("/api/v1/dealerships/" + dealership_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('object');
          response.body.data._id.should.be.equal(dealership_id);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we return an error when the dealership id doesn't exist in the system
  describe('Get Dealership API Error Test (dealership not found)', () => {
    it('should return 404 when the dealership is NOT present', (done) => {
      chai.request(app)
        .get("/api/v1/dealerships/718b3bf134f07d9a91c32a1b")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  //The below test checks if we can return a list of dealership successfully
  describe('Get Dealerships API Test', () => {
    it('should return 200 when it returns dealerships array', (done) => {
      chai.request(app)
        .get("/api/v1/dealerships")
        .set('authorization', 'Bearer ' + token)
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
    it('should return 200 when a dealership is updated', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/" + dealership_id)
        //we pass in the new dealership name in the body
        .send({
            "name": "Dealership #2",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.data.name.should.be.equal("Dealership #2");
          done();
        });
    });
  });

  //The below test, checks if we return an error when the dealership ID is not found
  describe('Update Dealership#1 API Error Test (dealership id not found)', () => {
    it('should return 404 error because dealership is not found', (done) => {
      chai.request(app)
        .put("/api/v1/dealerships/718b3bf134f07d9a91c32a1b")
        //we pass in the new dealership name in the body
        .send({
            "name": "Dealership #2",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  
  //The below test checks if we can delete dealership successfully
  describe('Delete Dealership API Test', () => {
    it('should return 200 when the dealership is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/" + dealership_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test checks if we return an error when attempting to delete a nonexistent dealership
  describe('Delete Dealership API Error Test (dealership id not found)', () => {
    it('should return 401 when the dealership is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/dealerships/718b3bf134f07d9a91c32a1b")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

});
  
