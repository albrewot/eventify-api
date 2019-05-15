const Joi = require("@hapi/joi");

const EventRegisterSchema = Joi.object().keys({
  name: Joi.string().required(),
  host: Joi.string().required(),
  description: Joi.string().default(null),
  start_date: Joi.date()
    .min("now")
    .required(),
  finish_date: Joi.date()
    .min(Joi.ref("start_date"))
    .required(),
  address: Joi.array().items(
    Joi.object().keys({
      description: Joi.string()
    })
  ),
  category: Joi.string().required(),
  type: Joi.string().required(),
  restriction: Joi.string().required(),
  modality: Joi.string().required(),
  country: Joi.string(),
  state: Joi.string(),
  city: Joi.string()
});

const EventEditSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string(),
  start_date: Joi.date().min("now"),
  finish_date: Joi.date().min(Joi.ref("start_date")),
  category: Joi.string(),
  type: Joi.string(),
  restriction: Joi.string(),
  modality: Joi.string(),
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

const InvitationCreateSchema = Joi.object().keys({
  event: Joi.string().required(),
  emails: Joi.array()
    .items(Joi.string().email())
    .required()
});

module.exports = {
  EventRegisterSchema,
  EventEditSchema,
  InvitationCreateSchema
};
