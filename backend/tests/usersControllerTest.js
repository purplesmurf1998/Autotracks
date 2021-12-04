let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

let admin_id = "";
let user_id = "";
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzgxMzc1ODUsImV4cCI6MTY0MDcyOTU4NX0.gv4Q-vPm-MqfHVsY7BYnBThxBI3bHZtUC5JtukHp340';

// The following tests test the entire User Controller Class
describe('Testing User Controller Class', () => {
  //The below test, checks if the app can create an Admin successfully
  describe('Create Admin API Test', () => {
    it('should return 200 when the admin is created', (done) => {
      chai.request(app)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "test",
          "last_name": "test",
          "email": "test@gmail.com",
          "role": "Administration",
          "password": "password123"
        })
        .end( (err, response) => {
          //Checks if the status code is 200
          response.should.have.status(200);
          admin_id = response.body.payload._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app refuses to create a user (Not admin) from the registration page
  describe('Create Admin API (Not Admin) Test', () => {
    it('should return 400 when because user is not an admin', (done) => {
      chai.request(app)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "test",
          "last_name": "test",
          "email": "test_user@gmail.com",
          "role": "Management",
          "password": "password123"
        })
        .end( (err, response) => {
          //Checks if the status code is 200
          response.should.have.status(400);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, ensures that we cannot create an admin that is already been created
  describe('Create Duplicate Admin API Test', () => {
    it('should return 400 when the admin already exists', (done) => {
      chai.request(app)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "test",
          "last_name": "test",
          "email": "test@gmail.com",
          "role": "Administration",
          "password": "password123"
        })
        .end( (err, response) => {
          //Checks if the status code is 400
          response.should.have.status(400);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app can create a user successfully
  describe('Create User API Test', () => {
    it('should return 200 when the user is created', (done) => {
      chai.request(app)
        .post("/api/v1/users")
        .send({
          "first_name": "test_staff",
          "last_name": "test_staff",
          "email": "test_staff@autotracks.com",
          "role": "Management",
          "permissions": [
            "Add Dealerships",
            "View Dealerships",
            "Edit Dealerships",
            "Delete Dealerships",
            "Add Staff Users",
            "View Staff Users",
            "Edit Staff Users",
            "Delete Staff Users",
            "Add Vehicles",
            "View Vehicles",
            "Edit Vehicle Properties",
            "Edit Vehicle Locations",
            "Sell Vehicles",
            "Delete Vehicles"
        ],
          "password": "password123",
          "dealership": "618b3bf134f07d9a91c32a1b" 
        })
        .set('authorization', token)
        //Need to have the token to be able to create users
        .end( (err, response) => {
          response.should.have.status(200);
          user_id = response.body.payload._id;
          done();
        });
    });
  });

  //The below test, checks if the app refuses to create a user that is not attached to a dealership from the registration page
  describe('Refuse Creating a User That is not Attached to a Dealership API Test', () => {
    it('should return 400 when because dealership does not exist', (done) => {
      chai.request(app)
        .post("/api/v1/users")
        .send({
          "first_name": "test_staff",
          "last_name": "test_staff",
          "email": "test_staff_no_dealership@autotracks.com",
          "role": "Management",
          "permissions": [
            "Add Dealerships",
            "View Dealerships",
            "Delete Vehicles"
          ],
          "password": "password123",
        })
        .set('authorization', token)
        //Need to have the token to be able to create users
        .end( (err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  //The below test, checks if the app refuses to create a staff account if the creator is not an admin
  describe('Create User API Test', () => {
    it('should return 200 when the user is created', (done) => {
      chai.request(app)
        .post("/api/v1/users")
        .send({
          "first_name": "test_staff",
          "last_name": "test_staff",
          "email": "test_staff_not_admin@autotracks.com",
          "role": "Management",
          "permissions": [
            "Add Dealerships",
          ],
          "password": "password123",
          "dealership": "618b3bf134f07d9a91c32a1b" 
        })
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWEyOTA3ZDA1NmQ2ZDY3ZTYwM2UxZWMiLCJpYXQiOjE2Mzg2NTU4MzYsImV4cCI6MTY0MTI0NzgzNn0.m8wq9bNU7bbak2A9y8id88Zvtwc_dEaWtZNFNWlr7q8')
        //Need to have the token to be able to create users
        .end( (err, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

  //The below test, checks if the app can return a user successfully
  describe('Get User API Test', () => {
    it('should return 200 when the user is present: ' + admin_id, (done) => {
      chai.request(app)
        .get("/api/v1/users/618aacf45cdc75b8288eb9b5") // + admin_id)
        .set('authorization', token)
        //pass the authorization token
        .end( (err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });

  //The below test, checks if the app can return a list of users successfully
  describe('Get Users API Test', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(app)
        .get("/api/v1/users")
        //pass the authorization token
        .set('authorization', token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test, checks if the app can update a user's first name successfully 
  describe('Update User API Test', () => {
    it('should return 200 when the user is present: ' + admin_id, (done) => {
      chai.request(app)
        .put("/api/v1/users/" + admin_id)
        .set('authorization', token)
        //It is a put request and we pass the new first_name that needs to be changed
        .send({
          "first_name": "test_update",
        })       
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('object');
          response.body.payload.first_name.should.be.equal("test_update");
          done();
        });
    });
  });

  //The below test, checks if the app can update a user's first name successfully 
  describe('Get Users API Test with Select Filter', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(app)
        .get("/api/v1/users/?role=Administration&select=first_name")
        .set('authorization', token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.data.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test, checks if the app can get a list of users using the Populate Filter
  describe('Get Users API Test with Populate Filter', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(app)
        //The qs below represents the populate filter
        .get("/api/v1/users/?role=Administration&populate=dealership")
        .set('authorization', token)
        .end( (err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.data.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });
  //The below test, checks if the app can delete admins successfully
  describe('Delete Admin API Test' + admin_id, () => {
    it('should return 200 when the user is deleted: ' + admin_id, (done) => {
      chai.request(app)
        .delete("/api/v1/users/" + admin_id)
        .set('authorization', token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app can delete users successfully
  describe('Delete User API Test' + user_id, () => {
    it('should return 200 when the user is deleted: ' + user_id, (done) => {
      chai.request(app)
        .delete("/api/v1/users/" + user_id)
        .set('authorization', token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.success.should.be.true;
          done();
        });
    });
  });
});