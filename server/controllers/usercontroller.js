import pool from '../models/connect';
import Helper from '../helpers/helperutils';

const UserController = {
  /**
     * Create a User
     * @param {object} req
     * @param {object} res
     * @returns {object} Json api response
     */
  async createUser(req, res) {
    const hashPassword = Helper.hashPassword(req.body.password);

    // parser.single('passporturl');
    // console.log(req.file);


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
      req.file.url,
    ];

    try {
      const { rows } = await pool.query(createQuery, values);

      const token = Helper.genrateToken(rows[0].id, rows[0].isadmin);
      return res.status(201).json({
        status: 201,
        data: [{
          token,
          user: rows,
        }],
      });
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return res.status(406).json({
          status: 406,
          message: 'user with this email already exist',
        });
      }
      return res.status(400).json({
        status: 400,
        error,
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
      const { rows } = await pool.query(text, [email]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          message: 'user with this details can not be found',
        });
      }
      if (!Helper.comparePassword(rows[0].password, password)) {
        return res.status(401).json({
          status: 401,
          message: 'wrong password, try again',
        });
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
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  },
};

export default UserController;
