import * as Joi from 'joi';

export const configSchema = Joi.object({
  DB_URI: Joi.string().required(),
});
