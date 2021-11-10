import Joi from "@hapi/joi";

const schema = Joi.object().keys({
  jobId: Joi.string().uuid().required(),
});

export default schema;
