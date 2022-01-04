let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Auth Controller Class
describe('Testing Auth Controller Class', () => {
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

  //The below test ensures that the user cannot sign in if he/she doesn't provide a password
  describe('Admin/User Sign In API Test with no pwd field', () => {
    it('should return 400 because of missing pwd field', (done) => {
      chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
            email,
        })
        .end( (err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

    //The below test checks if the app refuses signin attempts with invalid email
    describe('Admin/User Sign In API invalid email Test', () => {
      it('should return 401 because of Invalid Email', (done) => {
        chai.request(app)
          .post("/api/v1/auth/signin")
          .send({
              email: 'admin_test@account.com',
              password
          })
          .end( (err, response) => {
            response.should.have.status(401);
            done();
          });
      });
    });

  //The below test checks if the app refuse signin attempts with wrong pwd
  describe('Admin/User Sign In API Invalid Password Test', () => {
    it('should return 401 because of invalid pwd', (done) => {
      chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
            email,
            password: 'wrong_password'
        })
        .end( (err, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

  //The below test, checks if we can verify the admin/user's token successfully
  describe('Verify Admin/User Token API Test', () => {
    it('should return 200 when the admin/users token is valid', (done) => {
      chai.request(app)
        .post("/api/v1/auth/verify")
        .send({
            token
        })
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test, checks if we can reject invalid tokens
  describe('Verify Admin/User Token API Error Test', () => {
    it('should return 500 because token is invalid', (done) => {
      chai.request(app)
        .post("/api/v1/auth/verify")
        .send({
            token: 'Bearer testesttesttestesttesttestesttesttestesttesttestesttest1234testesttest'
        })
        .end( (err, response) => {
          response.should.have.status(500);
          done();
        });
    });
  });
  
  //The below test checks if Admin/User can log out successfully
  describe('Admin/User Log Out API Test', () => {
    it('should return 200 when the admin/users is logged out', (done) => {
      chai.request(app)
        .get("/api/v1/auth/logout")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.be.true;
          done();
        });
    });
  });

  //The below test checks if we can refuse pwd change attemps given a wrong user_id
  describe('Admin/User Change Password API Test', () => {
    it('should return 400 because of invalid user_id', (done) => {
      chai.request(app)
        .put("/api/v1/auth/changepassword/718aacf45cdc75b8288eb9b5")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
});