
let assert = require('assert');

let server = require('../server');
let chai = require('chai');
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let admin_id = "";
let user_id = "";
const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzY1ODgzODQsImV4cCI6MTYzOTE4MDM4NH0.cv6jonBB44Iu04MKJZ3TcNoneZr7AqfLfNsxDrvzsWE';

// The following tests test the entire User Controller Class
describe('Testing User Controller Class', () => {
  //The below test, checks if the app can create an Admin successfully
  describe('Create Admin API Test', () => {
    it('should return 200 when the admin is created', (done) => {
      chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "test",
          "last_name": "test",
          "email": "test@gmail.com",
          "role": "Administration",
          "password": "password123"
        })
        .end((err, response) => {
          //Checks if the status code is 200
          response.should.have.status(200);
          admin_id = response.body.payload._id;
          response.body.should.be.a('object');
          response.body.payload.email.should.be.eq('test@gmail.com');
          done();
        });
    });
  });

  //The below test, ensures that we cannot create an admin that is already been created
  describe('Create Duplicate Admin API Test', () => {
    it('should return 400 when the admin already exists', (done) => {
      chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          "first_name": "test",
          "last_name": "test",
          "email": "test@gmail.com",
          "role": "Administration",
          "password": "password123"
        })
        .end((err, response) => {
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
      chai.request(server)
        .post("/api/v1/users")
        .send({
          "first_name": "test_staff",
          "last_name": "test_staff",
          "email": "test_staff@gmail.com",
          "role": "Management",
          "password": "password123",
          "dealership": "618b3bf134f07d9a91c32a1b"
        })
        //Need to have the token to be able to create users
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          user_id = response.body.payload._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app can return a user successfully
  describe('Get User API Test', () => {
    it('should return 200 when the user is present', (done) => {
      chai.request(server)
        .get("/api/v1/users/" + admin_id)
        //pass the authorization token
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('object');
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app can return a list of users successfully
  describe('Get Users API Test', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(server)
        .get("/api/v1/users")
        //pass the authorization token
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

  //The below test, checks if the app can update a user's first name successfully 
  describe('Update User API Test', () => {
    it('should return 200 when the user is present', (done) => {
      chai.request(server)
        .put("/api/v1/users/" + admin_id)
        .set('authorization', authToken)
        //It is a put request and we pass the new first_name that needs to be changed
        .send({
          "first_name": "test_update",
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('object');
          response.body.should.be.a('object');
          response.body.payload.first_name.should.be.equal("test_update");
          done();
        });
    });
  });

  //The below test, checks if the app can update a user's first name successfully 
  describe('Get Users API Test with Select Filter', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(server)
        .get("/api/v1/users/?role=Administration&select=first_name")
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

  //The below test, checks if the app can get a list of users using the Populate Filter
  describe('Get Users API Test with Populate Filter', () => {
    it('should return 200 when it returns users array', (done) => {
      chai.request(server)
        //The qs below represents the populate filter
        .get("/api/v1/users/?role=Administration&populate=dealership")
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          //the response data should be an array of users
          response.body.payload.should.be.a('array');
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });
  //The below test, checks if the app can delete admins successfully
  describe('Delete Admin API Test', () => {
    it('should return 200 when the user is deleted', (done) => {
      chai.request(server)
        .delete("/api/v1/users/" + admin_id)
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if the app can delete users successfully
  describe('Delete User API Test', () => {
    it('should return 200 when the user is deleted', (done) => {
      chai.request(server)
        .delete("/api/v1/users/" + user_id)
        .set('authorization', authToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });
});