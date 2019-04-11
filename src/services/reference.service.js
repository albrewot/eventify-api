const db = require("../config/db");
const Reference = db.Reference;

class ReferenceService {
  async create(referenceParam) {
    try {
      for (let ref of referenceParam) {
        if (await Reference.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Reference [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await Reference.create(referenceParam);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }

  async getReferences() {
    try {
      const references = await Reference.find({});
      console.log("reference");
      if (!references || references.length <= 0) {
        console.log("reference err");
        throw {
          type: "not found",
          message: `There is no references to retrieve`,
          code: 210
        };
      }
      console.log("reference in");
      return references;
    } catch (err) {
      throw err;
    }
  }

  async getReferencesByParent(referenceParams) {
    const { id } = referenceParams;
    if (!id) {
      throw { type: "missing", message: `No id supplied`, code: 211 };
    }
    try {
      const references = await Reference.find({ parent: id }).populate(
        "parent"
      );
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No reference found", code: 212 };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }

  async getParents() {
    try {
      const references = await Reference.find({ parent: null });
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No reference found", code: 212 };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ReferenceService();
