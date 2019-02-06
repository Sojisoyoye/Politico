import db from '../models/index';

/**
 * VoteController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports VoteController
 */
const VoteController = {
  /**
     * @method registerUser
     * @description An endpoint to vote for a candidate
     * @param {object} req
     * @param {object} res
     * @returns {object} Json api response
     */
  async voteCandidate(req, res) {
    const text = 'INSERT INTO votes(office, candidate) VALUES($1, $2) RETURNING *';

    const values = [
      req.body.office,
      req.body.candidate,
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'sorry, you can not vote',
      });
    }
  },
};

export default VoteController;
