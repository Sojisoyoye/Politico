import pool from '../models/connect';

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
      const { rows } = await pool.query(text, values);
      return res.status(201).json({
        status: 201,
        message: 'You have voted successfully',
        data: rows[0],
      });
    } catch (error) {
      if (error.constraint === 'votes_candidate_fkey') {
        return res.status(404).json({
          status: 404,
          message: 'this candidate id doesn\'t exist',
        });
      }
      if (error.constraint === 'votes_office_fkey') {
        return res.status(404).json({
          status: 404,
          message: 'this office id doesn\'t exist',
        });
      }
      if (error.constraint === 'votes_pkey') {
        return res.status(403).json({
          status: 403,
          message: 'you have already voted for this office',
        });
      }
      return res.status(500).json({
        status: 500,
        message: 'Server Error',
      });
    }
  },
};

export default VoteController;
