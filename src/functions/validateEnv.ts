import { EnvSchema, ValidVars } from '../types';
import 'dotenv/config';
import logSymbols from 'log-symbols';

export const validateEnv = (schema: EnvSchema): ValidVars => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validatedVariables: ValidVars = {};

  for (const key in schema) {
    const envRaw = process.env[key]; // raw data from the .env
    const def = schema[key]; // user defined options given for the particular key or variable

    if (def.required && (envRaw === undefined || envRaw === '')) {
      // if var is required but undefined or empty valued
      errors.push(`${key} is required but not provided.`);
      continue; // stops this iteration and move to the next iteration
    }

    if (!def.required) {
      // if var is not required
      validatedVariables[key] = envRaw;
      warnings.push(`${key} is defined as not required, it may occur errors`);
      continue; // stops this iteration and move to the next iteration
    }

    // validating type of the env variable with defined types
    switch (def.type) {
      case 'string':
        validatedVariables[key] = envRaw;
        break;
      case 'number':
        if (isNaN(Number(envRaw!))) {
          errors.push(`${key} must be a valid number.`);
        } else {
          validatedVariables[key] = envRaw;
        }
        break;
      case 'boolean':
        if (envRaw === 'true' || envRaw === 'false') {
          validatedVariables[key] = envRaw;
        } else {
          errors.push(`${key} must be 'true' or 'false'.`);
        }
        break;
      case 'enum':
        if (!('values' in def)) {
          errors.push(`${key} is an enum but no values provided.`);
        } else if (!def.values?.includes(envRaw!)) {
          errors.push(`${key} must be one of: ${def.values?.join(', ')}`);
        } else {
          validatedVariables[key] = envRaw;
        }
        break;
      default:
        errors.push(`Unknown type "${def.type}" for ${key}`);
    }
  }

  if (warnings.length != 0) {
    console.error(logSymbols.warning, 'Invalid environment configuration:');
    errors.forEach((warn) => console.error(`- ${warn}`));
  }

  if (errors.length === 0) {
    console.log(logSymbols.success, 'Environment is valid!');
    return validatedVariables;
  } else {
    console.error(logSymbols.error, 'Invalid environment configuration:');
    errors.forEach((err) => console.error(`- ${err}`));
    process.exit(1);
  }
};
