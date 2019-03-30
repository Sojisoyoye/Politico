import pool from '../models/connect';

/**
 * candidateController
 * @description Specifies which method handles a given request for a candidate endpoint
 * @exports candidateController
 */

const CandidateController = {
  /**
   *
   * @method getCandidates Get all candidates
   * @description Gets the list of candidates
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  async getCandidates(req, res) {
    const findAllQuery = 'SELECT * FROM candidates';
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
};

export default CandidateController;
