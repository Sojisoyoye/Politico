import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const Helper = {
  /**
     * Hash password method
     * @param {string} password
     * @returns {string} returns hashed password
     */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  /**
   * Compare password method
   * @param {string} hashPadssword
   * @param {string} password
   * @returns {boolean} returns true or false
   */
  comparePassword(hashPadssword, password) {
    return bcrypt.compareSync(password, hashPadssword);
  },

  /**
   * Generate token method
   * @param {string} paylaod
   * @returns {string} token
   */
  genrateToken(id, isadmin, email) {
    const token = jwt.sign({ userId: id, isAdmin: isadmin, Email: email }, process.env.SECRET, { expiresIn: '7d' });
    return token;
  },

  verifyToken(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  },
};

export default Helper;
