const db = require("../config/db");
const Reference = db.Reference;
const References = db.References;

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

  async getType() {
    try {
      const references = await References.Type.find({});
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No types found", code: 212 };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }
  async getCategory() {
    try {
      const references = await References.Category.find({});
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No categories found", code: 212 };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }
  async getRestriction() {
    try {
      const references = await References.Restriction.find({});
      if (!references || references.length <= 0) {
        throw {
          type: "not found",
          message: "No restrictions found",
          code: 212
        };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }
  async getModality() {
    try {
      const references = await References.Modality.find({});
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No modalities found", code: 212 };
      }
      return references;
    } catch (err) {
      throw err;
    }
  }

  async createType(params) {
    try {
      if (params.length == 0 || !params) {
        throw { message: "no types supplied" };
      }
      for (let ref of params) {
        if (await References.Type.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Type [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await References.Type.create(params);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }
  async createCategory(params) {
    try {
      if (params.length == 0 || !params) {
        throw { message: "no categories supplied" };
      }
      for (let ref of params) {
        if (await References.Category.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Category [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await References.Category.create(params);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }
  async createRestriction(params) {
    try {
      if (params.length == 0 || !params) {
        throw { message: "no restrictions supplied" };
      }
      for (let ref of params) {
        if (await References.Restriction.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Restriction [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await References.Restriction.create(params);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }
  async createModality(params) {
    try {
      if (params.length == 0 || !params) {
        throw { message: "no modalities supplied" };
      }
      for (let ref of params) {
        if (await References.Modality.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Modality [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await References.Modality.create(params);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ReferenceService();
