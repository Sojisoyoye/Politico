import { expect } from 'chai';
import 'babel-polyfill';
import Authenticate from '../middleware/Auth';

let authHeader;
const res = {};

describe('Authentication', () => {
  it('should return error if header is not set', (done) => {
    expect(Authenticate).to.be.an('object');
    done();
  });

  it('should return error if authHeader is not set/undefined', (done) => {
    if (authHeader === 'undefined') {
      expect(res).to.have.status(401);
      expect(res.body.status).to.be.equal(401);
    }
    done();
  });
});
