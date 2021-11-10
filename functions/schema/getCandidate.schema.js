import Joi from "@hapi/joi";

const schema = Joi.object().keys({
  candidateId: Joi.string().required(),
});

export default schema;
