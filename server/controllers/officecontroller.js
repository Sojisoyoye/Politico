import officeDb from '../models/offices';

/**
 * @class OfficeController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports OfficeController
 */

class OfficeController {
  /**
   * @method postOffice
   * @description Posts the given office details to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static postOffice(req, res) {
    const {
      type, name,
    } = req.body;

    const id = officeDb.length + 1;
    const officeData = {
      id,
      type,
      name,
    };

    officeDb.push(officeData);

    res.status(201).json({
      status: 201,
      data: [{
        id,
        type,
        name,
        message: 'Office Created Successfully',
      }],
    });
  }

  /**
   * @method getOffices
   * @description Gets the list of offices
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getOffices(req, res) {
    res.status(200).json({ status: 200, data: [...officeDb] });
  }

  /**
   * @method getAOffice
   * @description Retrieves a specific office with a given iID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAOffice(req, res) {
    const data = officeDb.find(officeObj => officeObj.id === parseInt(req.params.id, 10));
    if (data) {
      return res.status(200).json({
        status: 200,
        data,
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'office record not found',
    });
  }
}

export default OfficeController;
