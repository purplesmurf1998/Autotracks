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
          //vehicle_id = 
          console.log(response);
          done();
        });
    });
  });

});
