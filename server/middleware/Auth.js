import jwt from 'jsonwebtoken';
import db from '../models/index';

const Auth = {
  /**
     * @method Verify Token
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {object|void} response object
     */

  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(400).json({
        status: 400,
        error: 'Token is not provided',
      });
    }
    try {
      const payload = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [payload.userId]);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'the token provided is invalid',
        });
      }
      req.user = { id: payload.userId };
      next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  },
};


export default Auth;
