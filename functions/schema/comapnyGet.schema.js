import Joi from "@hapi/joi";

const schema = Joi.object().keys({
  companyId: Joi.string().uuid().required(),
});

export default schema;
