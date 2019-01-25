import partyDb from '../models/parties';

/**
 * @class PartyController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports PartyController
 */

class PartyController {
  /**
   * @method postParty
   * @description Posts the given record to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static postParty(req, res) {
    const {
      name, hqAddress, logoUrl, Acroymn,
    } = req.body;

    const id = partyDb.length + 1;
    const recordData = {
      id,
      name,
      hqAddress,
      logoUrl,
      Acroymn,
    };

    partyDb.concat(recordData);

    res.status(201).json({
      status: 201,
      data: [{ id, message: 'Party Added Successfully' }],
    });
  }
}

export default PartyController;