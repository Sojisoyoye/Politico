import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import pool from '../models/connect';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

const file = fs.readFileSync(path.resolve(__dirname, './asset/NigeriaFlag.jpg'));

let adminToken;
let userToken;

describe('PARTIES', () => {
  describe('/POST political party', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@email.com', password: '123456' })
        .end((err, res) => {
          adminToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should add a new political party if details are correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .field('name', 'New Nigeria Party')
        .field('hqAddress', '1, Aso Rock, Abuja')
        .attach('logoUrl', file, 'NigeriaFlag.jpg')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return an error if political party name already exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .field('name', 'New Nigeria Party')
        .field('hqAddress', '1, Aso Rock, Abuja')
        .attach('logoUrl', file, 'NigeriaFlag.jpg')
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body.status).to.be.equal(406);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('party name already exist');
          done(err);
        });
    });

    it('should return an error if no authorization token was specified', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties')
        .set('authorization', 'svbbcgshfhjt65356672fgegf')
        .type('form')
        .field('name', 'New Nigeria Party')
        .field('hqAddress', '1, Aso Rock, Abuja')
        .attach('logoUrl', file, 'NigeriaFlag.jpg')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Token provided can not be authenticated');
          done(err);
        });
    });

    it('should return an error if an unauthorizated user tries to create a party', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '123456' })
        .end((err, res) => {
          userToken = res.body.data[0].token;
          expect(res).to.have.status(200);
          chai
            .request(app)
            .post('/api/v1/parties')
            .set('authorization', `Bearer ${userToken}`)
            .type('form')
            .field('name', 'New Nigeria Party')
            .field('hqAddress', '1, Aso Rock, Abuja')
            .attach('logoUrl', file, 'NigeriaFlag.jpg')
            .end((err1, res1) => {
              expect(res1).to.have.status(403);
              expect(res1.body.error).to.equal('You are not authorized. For Admins only');
              done(err);
            });
        });
    });

    it('should return server error for connection error to the database', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .post('/api/v1/parties')
        .set('authorization', `Bearer ${adminToken}`)
        .type('form')
        .field('name', 'New Nigeria Party')
        .field('hqAddress', '1, Aso Rock, Abuja')
        .attach('logoUrl', file, 'NigeriaFlag.jpg')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.status).to.be.equal(500);
          stub.restore();
          done(err);
        });
    });
  });

  describe('/GET political party', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '123456' })
        .end((err, res) => {
          userToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should get all political party', (done) => {
      chai
        .request(app)
        .get('/api/v1/parties')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should get a specific political party', (done) => {
      chai
        .request(app)
        .get('/api/v1/parties/1')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return error if specific political party can not be found', (done) => {
      chai
        .request(app)
        .get('/api/v1/parties/10')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('party record not found');
          done(err);
        });
    });

    it('should post to get a specific political party', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties/1/')
        .set('authorization', `Bearer ${userToken}`)
        .send({ party: 1 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return error if post can not get a specific political party', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties/10/')
        .set('authorization', `Bearer ${userToken}`)
        .send({ party: 10 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return server error for connection error to database to get a party', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .post('/api/v1/parties/1')
        .set('authorization', `Bearer ${userToken}`)
        .send({ party: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(err);
        });
    });

    it('should return server error for connection error to database', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .get('/api/v1/parties/1')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(err);
        });
    });
  });

  describe('/PATCH a specific political party', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@email.com', password: '123456' })
        .end((err, res) => {
          adminToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should update the name of a political party', (done) => {
      chai
        .request(app)
        .patch('/api/v1/parties/1')
        .set('authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Peoples Nigeria Party' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          done(err);
        });
    });

    it('should return error if party to update can not be found', (done) => {
      chai
        .request(app)
        .patch('/api/v1/parties/10')
        .set('authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Life Party' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('party not found');
          done(err);
        });
    });
  });

  describe('/DELETE a specific political party', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@email.com', password: '123456' })
        .end((err, res) => {
          adminToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should delete a specific political party', (done) => {
      chai
        .request(app)
        .delete('/api/v1/parties/2')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          done(err);
        });
    });

    it('should return error if specific political party can not be found', (done) => {
      chai
        .request(app)
        .delete('/api/v1/parties/10')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('party record not found');
          done(err);
        });
    });

    it('should return server error for connection error to database', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .delete('/api/v1/parties/2')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(err);
        });
    });
  });
});
