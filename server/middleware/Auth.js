import jwt from 'jsonwebtoken';
import db from '../models/index';

const Authenticate = {
  /**
     * @method Verify Token
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {object|void} response object
*/
  async verifyToken(req, res, next) {
    // const token = req.headers['x-access-token'];
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      res.status(401).json({ error: 'Unathorized - Header not set' });
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    // if (!token) {
    // res.status(400).json({
    // status: 400,
    // error: 'Token is not provided',
    // });
    // }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        res.status(400).json({
          status: 400,
          error: 'The token provided is invalid',
        });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      res.status(400).json({
        status: 400,
        error,
      });
    }
  },

  async verifyAdmin(req, res, next) {
    // const token = req.headers['x-access-token'];
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      res.status(401).json({ error: 'Unathorised - Header not set' });
      return;
    }
    const token = authHeader.split(' ')[1];
    // if (!token) {
    // res.status(400).json({
    // status: 400,
    // error: 'Token is not provided',
    // });
    // }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      if (decoded.isAdmin === 'false') {
        res.status(403).json({
          status: 403,
          error: 'You are not authorized',
        });
      }
      req.user = { isadmin: decoded.isAdmin };
      next();
    } catch (error) {
      res.status(400).json({
        status: 400,
        error,
      });
    }
  },
};

export default Authenticate;
