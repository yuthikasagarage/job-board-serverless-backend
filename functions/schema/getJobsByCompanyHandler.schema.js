import Joi from "@hapi/joi";

const schema = Joi.object().keys({
   companyHandler: Joi.string().required()
});


export default schema;
