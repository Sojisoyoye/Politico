import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const Helper = {
  /**
     * Hash password method
     * @param {string} password
     * @returns {string} returns hashed password
     */
  hashPadssword(password) {
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
   * Email helper method
   * @param {*} email
   */

  validEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  validPhoneNo(phoneNumber) {
    return /^\+[0-9]{13}$|^[0-9]{11}$/.test(phoneNumber);
  },

  validName(name) {
    return /^[a-zA-Z]+$/.test(name);
  },

  validPassportUrl(passportUrl) {
    return /^([0-9]|[A-z])+$/.test(passportUrl);
  },

  /**
   * Generate token method
   * @param {string} paylaod
   * @returns {string} token
   */
  genrateToken(id, isadmin) {
    const token = jwt.sign({ userId: id, isAdmin: isadmin }, process.env.SECRET, { expiresIn: '7d' });
    return token;
  },
};

export default Helper;
