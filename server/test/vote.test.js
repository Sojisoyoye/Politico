import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import pool from '../models/connect';
import VoteController from '../controllers/votecontroller';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('VoteController', () => {
  it('should be an object', (done) => {
    expect(VoteController).to.be.an('object');
    done();
  });
});

describe('VOTES', () => {
  describe('/VOTE candidate', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@email.com', password: '123456' })
        .end((err, res) => {
          userToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should vote a candidate for a political office', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 1,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.equal(201);
          expect(res.body.message).to.equal('You have voted successfully');
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return an error if no authorization was provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', '')
        .send({
          office: 1,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('Unauthorized - Header not set');
          done(err);
        });
    });

    it('should return an error if token provided is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', '89shvdii87uhgyt66r5ggffd445b')
        .send({
          office: 1,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Token provided can not be authenticated');
          done(err);
        });
    });

    it('should return an error if office id does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 10,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('this office id doesn\'t exist');
          done(err);
        });
    });

    it('should return an error if candidate id does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 2,
          candidate: 12,
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('this candidate id doesn\'t exist');
          done(err);
        });
    });

    it('should return an error if office is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: '',
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.equal(422);
          done(err);
        });
    });

    it('should return an error if invalid office is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 'a',
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.equal(422);
          done(err);
        });
    });

    it('should return an error if candidate is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 1,
          candidate: '',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.equal(422);
          done(err);
        });
    });

    it('should return an error if invalid candidate is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: '1',
          candidate: 'a',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.equal(422);
          done(err);
        });
    });

    it('should return an error if user has already voted for the same office', (done) => {
      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 1,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.equal(403);
          expect(res.body.message).to.equal('you have already voted for this office');
          done(err);
        });
    });

    it('should return server connection error to database if can not get candidates', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .post('/api/v1/votes')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          office: 1,
          candidate: 1,
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.status).to.equal(500);
          expect(res.body.message).to.equal('Server Error');
          stub.restore();
          done(err);
        });
    });
  });
});
