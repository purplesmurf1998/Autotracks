let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let zone_id = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Sale Controller Class
describe('Testing locationZone Controller Class', () => {
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

  //The below test, checks if we can create a zone successfully
  describe('Create Zone API Test', () => {
    it('should return 201 when a zone is created', (done) => {
        let paths = [
            {
                lat: '37.8951',
                lng: '-77.0364'
            },
            {
                lat: '38.8951',
                lng: '-77.0364'
            },
            {
                lat: '39.8951',
                lng: '-77.0364'
            },
        ]
        chai.request(app)
        .post("/api/v1/locations/zones")
        .send({
            path: paths,
            fillColor: "blue",
            name: 'test 1',
            description: 'zone test',
            dealership: '61eb8ea4caa229aa551cca3c',
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
            response.should.have.status(201);
            //We store the zone_id that we created so we can delete it later
            zone_id = response.body.payload._id;
            response.body.should.be.a('object');
            done();
        });
    });
  });

  //The below test, checks if we refuse to create a zone with less than 3 points
  describe('Create Zone API Error Test', () => {
    it('should return 400 because path has less than 3 points', (done) => {
        let paths = [
            {
                lat: '37.8951',
                lng: '-77.0364'
            },
            {
                lat: '38.8951',
                lng: '-77.0364'
            },
        ]
        chai.request(app)
        .post("/api/v1/locations/zones")
        .send({
            path: paths,
            fillColor: "blue",
            name: 'test 1',
            description: 'zone test',
            dealership: '61eb8ea4caa229aa551cca3c',
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            done();
        });
    });
  });

  //The below test, checks if we can fetch zones
  describe('Get Zones API Test', () => {
    it('should return 200 when zones are returned', (done) => {
      chai.request(app)
        .get("/api/v1/locations/zones/dealership/61eb8ea4caa229aa551cca3c")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test, checks if we can update a zone successfully
  describe('Update Zone API Test', () => {
    it('should return 201 when a zone is created', (done) => {
        let paths = [
            {
                lat: '37.7951',
                lng: '-77.0364'
            },
            {
                lat: '38.8951',
                lng: '-77.0364'
            },
            {
                lat: '39.8951',
                lng: '-77.0364'
            },
        ]
        chai.request(app)
        .put("/api/v1/locations/zones/" + zone_id)
        .send({
            path: paths,
            fillColor: "blue",
            name: 'test 1',
            description: 'zone test',
            dealership: '61eb8ea4caa229aa551cca3c',
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
            response.should.have.status(200);
            //We store the zone_id that we created so we can delete it later
            zone_id = response.body.payload._id;
            response.body.should.be.a('object');
            done();
        });
    });
  });

  //The below test, checks if we can delete a zone successfully
  describe('Delete Zone API Test', () => {
    it('should return 200 when zone is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/locations/zones/" + zone_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

})