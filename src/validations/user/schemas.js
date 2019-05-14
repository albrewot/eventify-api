const Joi = require("@hapi/joi");

const UserRegisterSchema = Joi.object().keys({
  username: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .required()
});

const UserEditSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string(),
  email: Joi.string().email(),
  lastName: Joi.string(),
  tlf: Joi.array().items(
    Joi.object().keys({
      dial_code: Joi.string(),
      phone_number: Joi.string()
    })
  ),
  address: Joi.array().items(
    Joi.object().keys({
      description: Joi.string()
    })
  ),
  country: Joi.string(),
  state: Joi.string(),
  city: Joi.string()
});

module.exports = {
  UserRegisterSchema,
  UserEditSchema
};
