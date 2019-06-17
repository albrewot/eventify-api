const db = require("../config/db");
const References = db.References;

class ReferenceService {
  async createReference(referenceParams) {
    try {
      let errors = [];
      let errorMessage = "";
      for (let refer of referenceParams) {
        if (!refer.parent) {
          refer.parent = null;
        }
        const reference = await References.Reference.find({
          name: refer.name,
          parent: refer.parent
        });
        console.log(reference);
        if (reference.length > 0) {
          errors.push(refer.name);
        }
      }
      if (errors.length > 0) {
        for (let error of errors) {
          errorMessage = errorMessage + `${error},`;
        }
        errorMessage = errorMessage.slice(0, errorMessage.length - 1);
        throw {
          type: "already exist",
          message: `The following references already exists [${errorMessage}]`
        };
      }
      const newReference = await References.Reference.create(referenceParams);
      return newReference;
    } catch (err) {
      throw err;
    }
  }

  async getReferences(type, parent = null) {
    try {
      const references = await References.Reference.find({ type, parent }).sort(
        "asc"
      );
      if (!references || references.length == 0) {
        throw {
          type: "not found",
          message: `There is no references with type: [${type}]`
        };
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

  async getGenre() {
    try {
      const references = await References.Genre.find({});
      if (!references || references.length <= 0) {
        throw { type: "not found", message: "No genre found", code: 212 };
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
  async createGenre(params) {
    try {
      if (params.length == 0 || !params) {
        throw { message: "no genres supplied" };
      }
      for (let ref of params) {
        if (await References.Genre.findOne({ name: ref.name })) {
          throw {
            type: "taken",
            message: `Genre [${ref.name}] already exists`,
            code: 209
          };
        }
      }

      const newRef = await References.Genre.create(params);
      if (newRef) {
        return newRef;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ReferenceService();
