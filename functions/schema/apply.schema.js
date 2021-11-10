import Joi from "@hapi/joi";

const schema = Joi.object().keys({
  id: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  stage: Joi.string(),
  companyId: Joi.string().required(),
  jobId: Joi.string().required(),
  email: Joi.string(),
  mobile: Joi.string(),
  cv: Joi.string(),
  managerInCharge: Joi.string(),
  answers: Joi.array(),
  __typename: Joi.string().required(),
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
  candidateTests: Joi.array(),
});

export default schema;
