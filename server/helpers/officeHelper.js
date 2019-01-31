import offices from '../models/offices';

/**
 *
 * @description Helper class that handles request to the offices data store
 * @class OfficeHelper
 */
class OfficeHelper {
  /**
     *
     * @description Helper method that creates an office
     * @static
     * @param {*} newOffice New office object to be created
     * @returns {object} An array with a value of the new office
     */
  static createOffice(newOffice) {
    const createdOffice = {
      id: offices[offices.length - 1].id + 1,
      type: newOffice.type,
      name: newOffice.name,
    };
    offices.push(createdOffice);
    return [createdOffice];
  }

  /**
     *
     * @description Helper method that gets current offices from the data store
     * @static
     * @returns {object} An array of objects of the offices
     */
  static allOffices() {
    return offices;
  }

  /**
     *
     * @description Helper method that gets a single office from the data store
     * @static
     * @returns {object} An array of object of the office
     * @param {*} officeId Id of the office to be retrieved
     */
  static getSingleOffice(officeId) {
    const officeFound = [];
    offices.forEach((office) => {
      if (office.id === officeId) {
        officeFound.push(office);
      }
    });
    return officeFound;
  }
}

export default OfficeHelper;
