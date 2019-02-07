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
    const text = 'INSERT INTO votes(createdby, office, candidate) VALUES($1, $2, $3) RETURNING *';

    const values = [
      req.user.id,
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
      return res.status(500).json({
        status: 500,
        error: 'Server error, unable to vote',
      });
    }
  },
};

export default VoteController;
