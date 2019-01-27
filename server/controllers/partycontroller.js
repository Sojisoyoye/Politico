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
    const partyData = {
      id,
      name,
      hqAddress,
      logoUrl,
      Acroymn,
    };

    partyDb.push(partyData);

    res.status(201).json({
      status: 201,
      data: [{ id, message: 'Party Added Successfully' }],
    });
  }

  /**
   * @method getParties
   * @description Gets the list of parties
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getParties(req, res) {
    res.status(200).json({ status: 200, data: [...partyDb] });
  }

  /**
   * @method getAParty
   * @description Retrieves a specific party with a given iID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAParty(req, res) {
    const data = partyDb.find(partyObj => partyObj.id === parseInt(req.params.id, 10));
    if (data) {
      return res.status(200).json({
        status: 200,
        data,
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'party record not found',
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
    const partyID = parseInt(req.params.id, 10);
    const { name } = req.body;

    partyDb.forEach((party, partyIndex) => {
      if (partyID === party.id) {
        partyDb[partyIndex].name = `${name}`;
      }
    });
    return res.status(200).json({
      status: 200, data: [{ id: partyID, message: 'Updated political party\'s name' }],
    });
  }

  /**
   * @method deleteParty
   * @description Deletes a specific political party
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static deleteParty(req, res) {
    const partyID = parseInt(req.params.id, 10);

    partyDb.forEach((party, partyIndex) => {
      if (partyID === party.id) {
        partyDb.splice(partyIndex, 1);
      }
    });
    return res.status(200).json({
      status: 200, data: [{ id: partyID, message: 'Political party deleted successfully' }],
    });
  }
}


export default PartyController;
