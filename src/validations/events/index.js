const Joi = require("@hapi/joi");

const schemas = require("./schemas");

const errorFinder = err => {
  console.log("errors", err.details);
  let errors = [];
  for (let detail of err.details) {
    errors.push(detail.message);
  }
  return { error: errors };
};

const selectSchema = (schema, body) => {
  const validation = Joi.validate(body, schema, (err, value) => {
    if (err) {
      const errors = errorFinder(err);
      return errors;
    } else {
      return value;
    }
  });
  return validation;
};

const switchEventSchema = (schema, body) => {
  console.log("schema", schema);
  let result;
  switch (schema) {
    case "register": {
      result = selectSchema(schemas.EventRegisterSchema, body);
      break;
    }
    case "edit": {
      result = selectSchema(schemas.EventEditSchema, body);
      break;
    }
    case "invitation_create": {
      result = selectSchema(schemas.InvitationCreateSchema, body);
      break;
    }
    case "pin_create": {
      result = selectSchema(schemas.PinCreateSchema, body);
      break;
    }
    case "pin_edit": {
      result = selectSchema(schemas.PinEditSchema, body);
      break;
    }
    default:
      result = { message: "error" };
  }

  return result;
};

module.exports = switchEventSchema;
