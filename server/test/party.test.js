import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

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
        .send({
          name: 'new nigeria party ',
          hqAddress: 'aso rock, abuja',
          logoUrl: 'www.nnp.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return an error if no authorization token was specified', (done) => {
      chai
        .request(app)
        .post('/api/v1/parties')
        .set('authorization', 'undefined')
        .send({
          name: 'new life nigeria party',
          hqAddress: 'ilupeju road',
          logoUrl: 'www.nlnp.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
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
        .patch('/api/v1/parties/1/name')
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
        .patch('/api/v1/parties/10/name')
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
  });
});
