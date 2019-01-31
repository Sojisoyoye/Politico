import OfficeHelper from '../helpers/officeHelper';

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
    const newOffice = OfficeHelper.createOffice({
      type,
      name,
    }); if (!req.body.type) {
      res.status(400).json({
        status: 400,
        data: [{ error: 'type is required' }],
      }); if (!req.body.name) {
        res.status(400).json({
          status: 400,
          data: [{ error: 'name is required' }],
        });
      }
      return;
    }
    res.status(201).json({
      status: 201,
      data: [{ newOffice, message: 'Office created successfully' }],
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
    const offices = OfficeHelper.allOffices();
    res.status(200).json({
      status: 200,
      data: [{ offices, message: 'All government offices retreived succesfully' }],
    });
  }

  /**
   * @method getAOffice
   * @description Retrieves a specific office with a given ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAOffice(req, res) {
    const officeId = parseInt(req.params.id, 10);
    const office = OfficeHelper.getSingleOffice(officeId);
    if (!office.length) {
      res.status(404).json({
        status: 404,
        error: 'office record not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: [{ office, message: 'Office retreived successfully' }],
    });
  }
}

export default OfficeController;
