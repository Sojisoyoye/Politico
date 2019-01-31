import parties from '../models/parties';

/**
 *
 * @description Helper class that handles request to the parties data store
 * @class PartyHelper
 */
class PartyHelper {
  /**
   *
   * @description Helper method that creates a party
   * @static
   * @param {*} newParty New party object to be created
   * @returns {object} An array with a value of the new party
   */
  static createParty(newParty) {
    const createdParty = {
      id: parties[parties.length - 1].id + 1,
      name: newParty.name,
      hqAddress: newParty.hqAddress,
      logoUrl: newParty.logoUrl,
      acroymn: newParty.acroymn,
    };
    parties.push(createdParty);
    return [createdParty];
  }

  /**
   *
   * @description Helper method that gets current parties from the data structure
   * @static
   * @returns {object} An array of objects of the parties
   */
  static allParties() {
    return parties;
  }

  /**
   *
   * @description Helper method that gets a single party from the data structure
   * @static
   * @returns {object} An array of object of the party
   * @param {*} partyId Id of the party to be retrieved
   */
  static getSingleParty(partyId) {
    const partyFound = [];
    parties.forEach((party) => {
      if (party.id === partyId) {
        partyFound.push(party);
      }
    });
    return partyFound;
  }

  /**
   *
   * @description Helper method that updates a party name
   * @static
   * @param {*} partyArg Updated party object body
   * @returns {object} An array with an object of the updated party
   */
  static editName(partyArg) {
    const updatedParty = [];
    parties.forEach((party) => {
      if (party.id === partyArg.id) {
        const modifiedParty = {
          id: party.id,
          name: party.name === partyArg.name ? party.name : partyArg.name,
          hqAddress: party.hqAddress,
          logoUrl: party.logoUrl,
          acroymn: party.acroymn,
        };
        updatedParty.push(modifiedParty);
        parties[parties.indexOf(party)] = modifiedParty;
      }
    });
    return updatedParty;
  }

  /**
   *
   * @description Helper method that delete a party
   * @static
   * @param {*} partyId Party ID of the party to be deleted
   */
  static removeParty(partyId) {
    let isRemoved = false;
    parties.forEach((party) => {
      if (party.id === partyId) {
        const partyIndex = parties.indexOf(party);
        parties.splice(partyIndex, 1);
        isRemoved = true;
      }
    });
    return isRemoved;
  }
}

export default PartyHelper;
