import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('/POST political party', () => {
  it('should add a new political party if details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/parties')
      .send({
        name: 'Accord',
        hqAddress: '6, Olowo Street, Ondo',
        logoUrl: 'www.accord.com',
        acroymn: 'A',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should not add a new political party if name is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/parties')
      .send({
        name: '',
        hqAddress: '6, Olowo Street, Ondo',
        logoUrl: 'www.accord.com',
        acroymn: 'A',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Name is required');
        done(err);
      });
  });
});

describe('/GET political parties', () => {
  it('should get the list of all the political parties', (done) => {
    chai
      .request(app)
      .get('/api/v1/parties')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should get a specific political party', (done) => {
    chai
      .request(app)
      .get('/api/v1/parties/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });

  it('should return an error if party does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/parties/10')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('party record not found');
        done(err);
      });
  });
});

describe('/PATCH a specific political party', () => {
  it('should update the name of a political party', (done) => {
    chai
      .request(app)
      .patch('/api/v1/parties/1/name')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });
});

describe('/DELETE a specific political party', () => {
  it('should delete a specific political party', (done) => {
    chai
      .request(app)
      .delete('/api/v1/parties/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });
});
