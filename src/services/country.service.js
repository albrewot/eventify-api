const db = require("../config/db");
const DialCode = db.DialCode;
const Country = db.Country;

class CountryService {
  //Todos los paises
  async getAllCountries() {
    return await Country.find({}).sort("name");
  }

  //Crea varios paises
  async createCountries(countries) {
    Country.create(countries, (err, country) => {
      if (err) {
        console.log(err);
        throw {
          type: "failed",
          message: `Error while inserting data`,
          code: 207
        };
      }
    });
  }

  //Optiene paises por id
  async getCountryById(countryId) {
    return await Country.findById(countryId);
  }

  //Optiene paises por estado
  async getCountryStates(countryId) {
    return await Country.findById(countryId).select("states");
  }

  //Optioene lo dial codes
  async getAllDialCodes() {
    return await DialCode.find({});
  }

  //Crea los dial codes
  async createDialCode(dialCodeParam) {
    const dialCode = dialCodeParam;
    DialCode.create(dialCode, (err, dial) => {
      if (err) {
        console.log(err);
        throw {
          type: "failed",
          message: `Error while inserting data`,
          code: 208
        };
      }
    });
  }
}

module.exports = new CountryService();
