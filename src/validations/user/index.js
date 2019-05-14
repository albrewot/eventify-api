const Joi = require("@hapi/joi");

const schemas = require("./schemas");

const switchUserSchema = (schema, body) => {
  let result;
  switch (schema) {
    case "register":
      {
        result = Joi.validate(
          body,
          schemas.UserRegisterSchema,
          (err, value) => {
            if (err) {
              console.log("errors", err.details);
              let errors = [];
              for (let detail of err.details) {
                errors.push(detail.message);
              }
              return { error: errors };
            } else {
              return value;
            }
          }
        );
        console.log(result);
      }
      break;
    case "edit":
      {
        result = Joi.validate(body, schemas.UserEditSchema, (err, value) => {
          if (err) {
            console.log("errors", err.details);
            let errors = [];
            for (let detail of err.details) {
              errors.push(detail.message);
            }
            return { error: errors };
          } else {
            return value;
          }
        });
        console.log(result);
      }
      break;
    default:
      result = { message: "error" };
  }

  return result;
};

module.exports = switchUserSchema;
