import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('VOTES', () => {
  describe('/VOTE candidate', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'foo@email.com', password: '123456' })
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
          expect(res.body).to.be.an('object');
          done(err);
        });
    });
  });
});
