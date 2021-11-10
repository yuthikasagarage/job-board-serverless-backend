import Joi from "@hapi/joi";

const schema = Joi.object().keys({
  userId: Joi.string().uuid().required(),
});

export default schema;
