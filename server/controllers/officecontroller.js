import db from '../models/index';

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
    const text = `INSERT INTO offices(type, name)
    VALUES($1, $2)
    RETURNING *`;
    const values = [
      req.body.type,
      req.body.name,
    ];

    try {
      const { rows } = await db.query(text, values);
      if (!req.body.name) {
        return res.status(400).json({
          status: 400,
          error: 'name must be entered',
        });
      }
      return res.status(201).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'can not create office',
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
      const { rows } = await db.query(findAllQuery);
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'can not retrieve offices record',
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
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'office record not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'can not retreive office record',
      });
    }
  },
};

export default OfficeController;
