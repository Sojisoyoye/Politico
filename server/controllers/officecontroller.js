import pool from '../models/connect';

/**
 * OfficeController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports OfficeController
 */

const OfficeController = {
  /**
   * @method postOffice
   * @description Posts the given office details to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async postOffice(req, res) {
    const text = `INSERT INTO offices(name, type)
    VALUES($1, $2)
    RETURNING *`;
    const values = [
      req.body.name,
      req.body.type,
    ];

    try {
      const { rows } = await pool.query(text, values);
      return res.status(201).json({
        status: 201,
        message: 'Office Created Successfully',
        data: rows[0],
      });
    } catch (error) {
      if (error.constraint === 'offices_name_key') {
        return res.status(406).json({
          status: 406,
          message: 'Office name already exist',
        });
      }
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  },

  /**
   * @method getOffices
   * @description Gets the list of offices
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getOffices(req, res) {
    const findAllQuery = 'SELECT * FROM offices';
    try {
      const { rows } = await pool.query(findAllQuery);
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  },

  /**
   * @method getAOffice
   * @description Retrieves a specific office with a given ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getAOffice(req, res) {
    const text = 'SELECT * FROM offices WHERE id = $1';
    try {
      const { rows } = await pool.query(text, [req.params.id]);
      if (rows[0]) {
        res.status(200).json({
          status: 200,
          data: rows[0],
        });
      }
      if (!rows[0]) {
        res.status(404).json({
          status: 404,
          error: 'office record not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  },

  async getPostAOffice(req, res) {
    const id = parseInt(req.params.id, 10);
    const getOneQuery = 'SELECT * FROM offices WHERE id = $1';
    const value = [id];

    try {
      const { rows } = await pool.query(getOneQuery, value);
      if (rows[0]) {
        res.status(200).json({
          status: 200,
          data: rows[0],
        });
      }
      if (!rows[0]) {
        res.status(404).json({
          status: 404,
          error: 'office record not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  },

  /**
   * @method registerUser
   * @description registers a user running for an office
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} JSON API response
   */
  async registerUser(req, res) {
    const findOneQuery = 'SELECT * FROM users WHERE id=$1';

    const registerUserQuery = 'INSERT INTO candidates(office, party, candidate) VALUES($1, $2, $3) RETURNING id, office';
    try {
      await pool.query(findOneQuery, [req.params.id]);
      const values = [
        req.body.office,
        req.body.party,
        req.params.id,
      ];
      const response = await pool.query(registerUserQuery, values);
      return res.status(200).json({
        status: 200,
        message: 'User registered successfully',
        data: response.rows[0],
      });
    } catch (error) {
      if (error.constraint === 'candidates_candidate_fkey') {
        return res.status(404).json({
          status: 404,
          message: 'User can not be found',
        });
      }
      if (error.constraint === 'candidates_office_fkey') {
        return res.status(404).json({
          status: 404,
          message: 'Office can not be found',
        });
      }
      if (error.constraint === 'candidates_party_fkey') {
        return res.status(404).json({
          status: 404,
          message: 'Party can not be found',
        });
      }
      if (error.constraint === 'candidates_pkey') {
        return res.status(406).json({
          status: 406,
          message: 'Candidate already registered',
        });
      }
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  },

  /**
   * @method getResult
   * @description Retrieves the result of a specific office
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getResult(req, res) {
    const office = parseInt(req.params.id, 10);

    const text = 'SELECT office, candidate, COUNT (candidate) FROM votes WHERE office = $1 GROUP BY candidate, office';

    const value = [office];

    try {
      const rowResp = await pool.query(text, value);
      const { rows } = rowResp;
      if (rows) {
        // console.log(rows);
        res.status(200).json({
          status: 200,
          data: rows,
        });
      }
      // if (!rows) {
      // res.status(404).json({
      // status: 404,
      // message: 'No votes for this office',
      // });
      // }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error,
      });
    }
  },
};

export default OfficeController;
