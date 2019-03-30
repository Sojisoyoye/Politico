import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import pool from '../models/connect';
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

    it('should not create an office if invalid type is entered', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          type: '*&^&%&',
          name: 'Governor',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should not create an office if invalid name is entered', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          type: 'State',
          name: '&&%#&^&',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if political office name already exists', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          type: 'State',
          name: 'Governor',
        })
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body.status).to.be.equal(406);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Office name already exist');
          done(err);
        });
    });

    it('should return an error if invalid authorization token was specified', (done) => {
      chai
        .request(app)
        .post('/api/v1/offices')
        .set('authorization', 'svbbcgshfhjbbdnd376383bbbdb')
        .send({
          type: 'State',
          name: 'Governor',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Token provided can not be authenticated');
          done(err);
        });
    });

    it('should return an error if an unauthorizated user tries to create an office', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '123456' })
        .end((err, res) => {
          userToken = res.body.data[0].token;
          expect(res).to.have.status(200);
          chai
            .request(app)
            .post('/api/v1/offices')
            .set('authorization', `Bearer ${userToken}`)
            .send({
              type: 'State',
              name: 'Governor',
            })
            .end((err1, res1) => {
              expect(res1).to.have.status(403);
              expect(res1.body.error).to.equal('You are not authorized. For Admins only');
              done(err);
            });
        });
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

  it('should return server error for connection error to database', (done) => {
    const stub = sinon.stub(pool, 'query').throws();

    chai
      .request(app)
      .get('/api/v1/offices')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        stub.restore();
        done(err);
      });
  });

  it('should return error if invalid authorization token is specified', (done) => {
    chai
      .request(app)
      .get('/api/v1/offices')
      .set('authorization', 'hgvvge3773673egvggvhvdhv')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Token provided can not be authenticated');
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

  it('should post to get a specific political office', (done) => {
    chai
      .request(app)
      .post('/api/v1/offices/1/')
      .set('authorization', `Bearer ${userToken}`)
      .send({ office: 1 })
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
      .post('/api/v1/offices/10/')
      .set('authorization', `Bearer ${userToken}`)
      .send({ office: 10 })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body).to.be.an('object');
        done(err);
      });
  });

  it('should return server error for connection error to database to get an office', (done) => {
    const stub = sinon.stub(pool, 'query').throws();

    chai
      .request(app)
      .post('/api/v1/offices/1')
      .set('authorization', `Bearer ${userToken}`)
      .send({ office: 1 })
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
      .get('/api/v1/offices/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        stub.restore();
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

  it('should not get result of a specific political office if parameter is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/1/result')
      .set('authorization', `Bearer ${userToken}`)
      .send({ office: 'a' })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.equal(422);
        // expect(res.body).to.be.an('object');
        done(err);
      });
  });

  it('should return server error for connection error to database', (done) => {
    const stub = sinon.stub(pool, 'query').throws();

    chai
      .request(app)
      .post('/api/v1/office/1/result')
      .set('authorization', `Bearer ${userToken}`)
      .send({ office: 1 })
      .end((err, res) => {
        expect(res.status).to.equal(500);
        stub.restore();
        done(err);
      });
  });
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
        expect(res.body.message).to.equal('User registered successfully');
        done(err);
      });
  });

  it('should return an error if invalid authorization token was specified', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/2/register')
      .set('authorization', 'svbbcgshfhjbbdnd376383bbbdb')
      .send({
        office: '2',
        party: '1',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Token provided can not be authenticated');
        done(err);
      });
  });

  it('should return error if user can not be found', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/15/register')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        office: 2,
        party: 1,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('User can not be found');
        done(err);
      });
  });

  it('should return error if office can not be found', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/3/register')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        office: 20,
        party: 1,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Office can not be found');
        done(err);
      });
  });

  it('should return error if party can not be found', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/3/register')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        office: 2,
        party: 20,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Party can not be found');
        done(err);
      });
  });

  it('should return error if candidate is already registered', (done) => {
    chai
      .request(app)
      .post('/api/v1/office/2/register')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        office: 2,
        party: 1,
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body.status).to.equal(406);
        expect(res.body.message).to.equal('Candidate already registered');
        done(err);
      });
  });
});
