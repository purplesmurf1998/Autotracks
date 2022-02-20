let app = require('../server.js');
let chai = require('chai');
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let sale_id = "";

//creds
const email = "admin@account.com";
const password = "password";
let token = "";

// The following tests test the entire Sale Controller Class
describe('Testing Sale Controller Class', () => {
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

  //The below test, checks if we can create a sale successfully
  describe('Create Sale API Test', () => {
    it('should return 201 when a sale is created', (done) => {
      chai.request(app)
        .post("/api/v1/inventory/details/sale")
        .send({
            "dealership": "61eb8ea4caa229aa551cca3c",
            "vehicle": "61eb8f67caa229aa551cca9b",
            "deposit_amount": 50,
            "sale_amount": 5000,
            "sales_rep": "61d4e5bb12d6b3b54a70e4dd",
            "approved_by": "6192c675d871bef9ad3887d1",
            "notes": "test",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(201);
          //We store the sale_id that we created so we can delete it later
          sale_id = response.body.payload._id;
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse to create a duplicate sale per vehicle
  describe('Create Sale API Error Test', () => {
    it('should return 400 because sale already exists', (done) => {
      chai.request(app)
        .post("/api/v1/inventory/details/sale")
        .send({
            "dealership": "61eb8ea4caa229aa551cca3c",
            "vehicle": "61eb8f67caa229aa551cca9b",
            "deposit_amount": 50,
            "sale_amount": 5000,
            "sales_rep": "61d4e5bb12d6b3b54a70e4dd",
            "approved_by": "6192c675d871bef9ad3887d1",
            "notes": "test",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can fetch sales
  describe('Get Sales API Test', () => {
    it('should return 200 when sales are returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/details/sale/dealership/61eb8ea4caa229aa551cca3c")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.payload.should.be.a('array');
          done();
        });
    });
  });

  //The below test, refuses to return a list of sales because dealership doesnt exist
  describe('Get Sales API Error Test (Invalid dealership_id)', () => {
    it('should return 404 because dealership_id is not valid', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/details/sale/618b3bf134f07d9a91c32b1a")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  //The below test, refuses to return a list of empty sales
  describe('Get Sales API Error Test (No sales)', () => {
    it('should return 404 because the dealership doesnt have sales in it', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/details/sale/61a7f8561f1880abfb2f4330")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  //The below test, checks if we can fetch a sale
  describe('Get Sale API Test', () => {
    it('should return 200 when a sale is returned', (done) => {
      chai.request(app)
        .get("/api/v1/inventory/details/sale/" + sale_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can update and mark sale as approved successfully
  describe('Update Sale API Test (Approve)', () => {
    it('should return 200 when a sale is marked approved', (done) => {
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getFullYear() + "-" + date_ob.getMonth() + 1 + "-" + date_ob.getDate();
      chai.request(app)
        .put("/api/v1/inventory/details/sale/" + sale_id)
        .send({
            "date_approved": date
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can update a sale (change sale_amount) successfully
  describe('Update Sale API Test (change sale_amount)', () => {
    it('should return 200 when a sale details are modified', (done) => {
      chai.request(app)
        .put("/api/v1/inventory/details/sale/" + sale_id)
        .send({
            "deposit_amount": 500,
            "sale_amount": 50000,
            "notes": "test",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse updating a sale given invalid id
  describe('Update Sale API Error Test (Invalid sale_id)', () => {
    it('should return 404 because sale id is not valid', (done) => {
      chai.request(app)
        .put("/api/v1/inventory/details/sale/61edb7f7b921821a0949db43")
        .send({
            "deposit_amount": 500,
            "sale_amount": 50000,
            "notes": "test",
        })
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we can delete a sale successfully
  describe('Delete Sale API Test', () => {
    it('should return 200 when a sale is deleted', (done) => {
      chai.request(app)
        .delete("/api/v1/inventory/details/sale/" + sale_id)
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  //The below test, checks if we refuse to delete a sale given invalid id
  describe('Delete Sale API Error Test (Invalid id)', () => {
    it('should return 404 because sale_id is invalid', (done) => {
      chai.request(app)
        .delete("/api/v1/inventory/details/sale/61edb7f7b921821a0949db43")
        .set('authorization', 'Bearer ' + token)
        .end( (err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

});