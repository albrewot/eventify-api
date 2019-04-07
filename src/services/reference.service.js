const db = require("../config/db");
const Reference = db.Reference;

class ReferenceService {
  async create(referenceParam) {
    try {
      for (let ref of referenceParam) {
        if (await Reference.findOne({ name: ref.name })) {
          throw `Reference [${ref.name}] already exists`;
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
        throw `There is no references to retrieve`;
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
      throw `No id supplied`;
    }
    try {
      const references = await Reference.find({ parent: id }).populate(
        "parent"
      );
      if (!references || references.length <= 0) {
        throw "No reference found";
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
        throw "No references found";
      }
      return references;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ReferenceService();
