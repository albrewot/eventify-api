const db = require("../helpers/db");
const DialCode = db.DialCode;
const Country = db.Country;

class CountryService {
  async getAllCountries() {
    return await Country.find({});
  }

  async createAllCountries(countries) {
    Country.create(countries, (err, country) => {
      if (err) {
        console.log(err);
        throw `Error while inserting data`;
      }
    });
  }

  async getCountryById(countryId) {
    return await Country.findById(countryId);
  }

  async getCountryStates(countryId) {
    return await Country.findById(countryId).select("states");
  }

  async getAllDialCodes() {
    return await DialCode.find({});
  }

  async createDialCode(dialCodeParam) {
    const dialCode = dialCodeParam;
    DialCode.create(dialCode, (err, dial) => {
      if (err) {
        console.log(err);
        throw `Error while inserting data`;
      }
    });
  }
}

module.exports = new CountryService();
