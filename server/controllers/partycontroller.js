import db from '../models/index';

/**
 * PartyController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports PartyController
 */

const PartyController = {
  /**
   * @method postParty Create a Party
   * @description Posts the given party details to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async postParty(req, res) {
    const text = `INSERT INTO parties(name, hqAddress, logoUrl)
    VALUES($1, $2, $3)
    RETURNING id, name`;
    const values = [
      req.body.name,
      req.body.hqAddress,
      req.body.logoUrl,
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'enter required credentials',
      });
    }
  },

  /**
   *
   * @method getParties Get all partues
   * @description Gets the list of parties
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getParties(req, res) {
    const findAllQuery = 'SELECT * FROM parties';
    try {
      const { rows } = await db.query(findAllQuery);
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'can not retrieve parties record',
      });
    }
  },

  /**
   * @method getAParty Get a Party
   * @description Retrieves a specific party with a given ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getAParty(req, res) {
    const text = 'SELECT * FROM parties WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'party record not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'can not retreive party record',
      });
    }
  },


  /**
   * @method updateName
   * @description Updates the name of a specific political party
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async updateName(req, res) {
    const findOneQuery = 'SELECT * FROM parties WHERE id=$1';
    const updateOneQuery = `UPDATE parties 
    SET name=$1 WHERE id=$2 returning id, name`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'party record not found',
        });
      }
      const value = [
        req.body.name || rows[0].name,
        req.params.id,
      ];
      const response = await db.query(updateOneQuery, value);
      return res.status(200).json({
        status: 200,
        data: [response.rows[0]],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'name can not be updated',
      });
    }
  },

  /**
   * @method deleteParty
   * @description Deletes a specific political party
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {boolean} Deletion status
   * @returns {object} JSON API Response
   */
  async deleteParty(req, res) {
    const deleteQuery = 'DELETE FROM parties WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'party record not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{ message: 'party deleted successfully' }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'party not deleted',
      });
    }
  },
};

export default PartyController;
