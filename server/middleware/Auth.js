import jwt from 'jsonwebtoken';

const Authenticate = {
  /**
     * @method Verify Token
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {object|void} response object
*/
  async verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      res.status(401).json({ error: 'Unathorized - Header not set' });
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      if (!decoded.userId) {
        res.status(400).json({
          status: 400,
          error: 'Token is Invalid',
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
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'undefined') {
      res.status(401).json({ error: 'Unathorised - Header not set' });
      return;
    }
    const token = authHeader.split(' ')[1];
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
