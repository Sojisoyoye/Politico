import PartyHelper from '../helpers/partyHelper';

/**
 * @class PartyController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports PartyController
 */

class PartyController {
  /**
   * @method postParty
   * @description Posts the given party details to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static postParty(req, res) {
    const {
      name, hqAddress, logoUrl, acroymn,
    } = req.body;
    const newParty = PartyHelper.createParty({
      name,
      hqAddress,
      logoUrl,
      acroymn,
    });
    res.status(201).json({
      status: 201,
      data: [{ newParty, message: 'party created successfully ' }],
    });
  }

  /**
   *
   * @method getParties
   * @description Gets the list of parties
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getParties(req, res) {
    const parties = PartyHelper.allParties();
    res.status(200).json({
      status: 200,
      data: [{ parties, message: 'All political parties retreived succesfully' }],
    });
  }

  /**
   * @method getAParty
   * @description Retrieves a specific party with a given ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAParty(req, res) {
    const partyId = parseInt(req.params.id, 10);
    const party = PartyHelper.getSingleParty(partyId);
    if (!party.length) {
      res.status(404).json({
        status: 404,
        error: 'party record not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: [{ party, message: 'party retreived successfully' }],
    });
  }


  /**
   * @method updateName
   * @description Updates the name of a specific political party
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static updateName(req, res) {
    const id = parseInt(req.params.id, 10);
    const {
      name,
    } = req.body;
    const updatedParty = PartyHelper.editName({
      id,
      name,
    });
    if (!updatedParty.length) {
      res.status(404).json({
        status: 404,
        error: 'party record not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: [{ message: 'name updated successfully' }],
    });
  }

  /**
   * @method deleteParty
   * @description Deletes a specific political party
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {boolean} Deletion status
   * @returns {object} JSON API Response
   */
  static deleteParty(req, res) {
    const partyId = parseInt(req.params.id, 10);
    const isDeleted = PartyHelper.removeParty(partyId);
    if (!isDeleted) {
      res.status(404).json({
        status: 404,
        error: 'party record not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: [{ message: 'party deleted succesfully' }],
    });
  }
}


export default PartyController;
