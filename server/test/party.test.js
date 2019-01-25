import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST political party', () => {
  it('should add a new political party if details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/parties')
      .send({
        name: 'Accord',
        hqAdress: '6, Olowo Street, Ondo',
        logoUrl: 'www.accord.com',
        Acroymn: 'A',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });
});
