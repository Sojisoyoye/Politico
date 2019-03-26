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
    if (!authHeader) {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized - Header not set',
      });
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          status: 401,
          message: 'Token provided can not be authenticated',
        });
      }
    }
  },

  async verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        status: 401,
        error: 'Unauthorised - Header not set',
      });
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      if (decoded.isAdmin === 'false') {
        res.status(403).json({
          status: 403,
          error: 'You are not authorized. For Admins only',
        });
        return;
      }
      req.user = { isadmin: decoded.isAdmin };
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          status: 401,
          message: 'Token provided can not be authenticated',
        });
      }
    }
  },
};

export default Authenticate;
