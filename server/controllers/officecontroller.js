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
}

export default OfficeController;
