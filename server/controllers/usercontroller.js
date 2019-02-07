import db from '../models/index';
import Helper from '../helpers/helperutils';

const UserController = {
  /**
     * Create a User
     * @param {object} req
     * @param {object} res
     * @returns {object} Json api response
     */
  async createUser(req, res) {
    const hashPassword = Helper.hashPadssword(req.body.password);

    const createQuery = `INSERT INTO
    users(firstname, lastname, othername, email, password, phonenumber, passporturl)
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.othername,
      req.body.email,
      hashPassword,
      req.body.phonenumber,
      req.body.passporturl,
    ];

    try {
      const { rows } = await db.query(createQuery, values);

      const token = Helper.genrateToken(rows[0].id, rows[0].isadmin);
      return res.status(201).json({
        status: 201,
        data: [{
          token,
          user: rows,
        }],
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 400,
          error,
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'server error, can not sign up',
      });
    }
  },

  /**
   * Login User
   * @param {object} req
   * @param {object} res
   * @returns {object} Json api response
   */
  async loginUser(req, res) {
    const { email, password } = req.body;
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [email]);
      if (!rows[0]) {
        return res.status(400).json({ message: 'The credentials are incorrect' });
      }
      if (!Helper.comparePassword(rows[0].password, password)) {
        return res.status(400).json({ message: 'password incorrect' });
      }
      const token = Helper.genrateToken(rows[0].id, rows[0].isadmin);
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          user: {
            id: rows[0].id,
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            othername: rows[0].othername,
            email: rows[0].email,
            phonenumber: rows[0].phonenumber,
            passporturl: rows[0].passporturl,
            isadmin: rows[0].isadmin,
          },
        }],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'server error, can not log in user',
      });
    }
  },
};

export default UserController;
