let assert = require('assert');

let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");
const { protect } = require('../middleware/auth');

chai.should();
chai.use(chaiHttp);

const email = "admin@account.com";
const password = "adminpassword";
let token = "";

describe('Testing Auth Controller Class', () => {
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

//   describe('Create Duplicate Admin API Test', () => {
//     it('should return 400 when the admin already exists', (done) => {
//       chai.request(app)
//         .post("/api/v1/auth/register")
//         .send({
//           "first_name": "test",
//           "last_name": "test",
//           "email": "test@gmail.com",
//           "role": "Administration",
//           "password": "password123"
//         })
//         .end( (err, response) => {
//           response.should.have.status(400);
//           response.body.should.be.a('object');
//           done();
//         });
//     });
//   });

//   describe('Create User API Test', () => {
//     it('should return 200 when the user is created', (done) => {
//       chai.request(app)
//         .post("/api/v1/users")
//         .send({
//           "first_name": "test_staff",
//           "last_name": "test_staff",
//           "email": "test_staff@gmail.com",
//           "role": "Management",
//           "password": "password123",
//           "dealership": "6186d06df44c867a394801dc"
//         })
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           user_id = response.body.user._id;
//           response.body.should.be.a('object');
//           done();
//         });
//     });
//   });

//   describe('Get User API Test', () => {
//     it('should return 200 when the user is present: ' + admin_id, (done) => {
//       chai.request(app)
//         .get("/api/v1/users/" + admin_id)
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.data.should.be.a('object');
//           response.body.should.be.a('object');
//           done();
//         });
//     });
//   });

//   describe('Get Users API Test', () => {
//     it('should return 200 when it returns users array', (done) => {
//       chai.request(app)
//         .get("/api/v1/users")
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.data.should.be.a('array');
//           response.body.should.be.a('object');
//           response.body.success.should.be.true;
//           done();
//         });
//     });
//   });
  
//   describe('Update User API Test', () => {
//     it('should return 200 when the user is present: ' + admin_id, (done) => {
//       chai.request(app)
//         .put("/api/v1/users/" + admin_id)
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .send({
//           "first_name": "test_update",
//         })       
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.data.should.be.a('object');
//           response.body.should.be.a('object');
//           response.body.data.first_name.should.be.equal("test_update");
//           done();
//         });
//     });
//   });

//   describe('Get Users API Test with Select Filter', () => {
//     it('should return 200 when it returns users array', (done) => {
//       chai.request(app)
//         .get("/api/v1/users/?role=Administration&select=first_name")
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.data.should.be.a('array');
//           response.body.should.be.a('object');
//           response.body.success.should.be.true;
//           done();
//         });
//     });
//   });

//   describe('Get Users API Test with Populate Filter', () => {
//     it('should return 200 when it returns users array', (done) => {
//       chai.request(app)
//         .get("/api/v1/users/?role=Administration&populate=dealership")
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.data.should.be.a('array');
//           response.body.should.be.a('object');
//           response.body.success.should.be.true;
//           done();
//         });
//     });
//   });

//   describe('Delete Admin API Test' + admin_id, () => {
//     it('should return 200 when the user is deleted: ' + admin_id, (done) => {
//       chai.request(app)
//         .delete("/api/v1/users/" + admin_id)
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           done();
//         });
//     });
//   });

//   describe('Delete User API Test' + user_id, () => {
//     it('should return 200 when the user is deleted: ' + user_id, (done) => {
//       chai.request(app)
//         .delete("/api/v1/users/" + user_id)
//         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc2YzQ4ZjgyNWZiYzZhYWM3MTJiNjIiLCJpYXQiOjE2MzYwNzcxOTgsImV4cCI6MTYzODY2OTE5OH0.uJkO3U2Wx16cCUO-9vhphVzx34MbO4sEOJNeOXj3dD8')
//         .end( (err, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           done();
//         });
//     });
//   });
});