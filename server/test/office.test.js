import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let adminToken;
let userToken;

describe('OFFICES', () => {
  describe('/POST political office', () => {
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

    it('should return error if header is not present', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .send({
          type: 'State',
          name: 'Governor Lagos',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });

    it('should create a new political office', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          type: 'State',
          name: 'Governor',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });
  });

  describe('/GET political offices', () => {
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

    it('should get the list of all the political offices', (done) => {
      chai
        .request(app)
        .get('/api/v1/offices')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should get a specific political office', (done) => {
      chai
        .request(app)
        .get('/api/v1/offices/1')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return error if specific political office can not be found', (done) => {
      chai
        .request(app)
        .get('/api/v1/offices/10')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('office record not found');
          done(err);
        });
    });

    it('should get result of a specific political office', (done) => {
      chai
        .request(app)
        .post('/api/v1/office/1/result')
        .set('authorization', `Bearer ${userToken}`)
        .send({ office: 1 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    // it('should return error if specific office result can not be found', (done) => {
    // chai
    // .request(app)
    // .post('/api/v1/office/10/result')
    // .set('authorization', `Bearer ${userToken}`)
    // .send({ office: 10 })
    // .end((err, res) => {
    // expect(res).to.have.status(404);
    // expect(res.body.status).to.be.equal(404);
    // expect(res.body).to.be.an('object');
    // expect(res.body.error).to.equal('no votes for this office');
    // done(err);
    // });
    // });
  });

  describe('/POST a user to run for an office', () => {
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

    it('should register a user to run for a political office', (done) => {
      chai
        .request(app)
        .post('/api/v1/office/2/register')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          office: 2,
          party: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          done(err);
        });
    });
  });
});
