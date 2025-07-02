import { EnvSchema } from '../types/types';
import 'dotenv/config';

type ValidateRawEnvRes = {
  errors: string[];
  warnings: string[];
  variables: Record<string, unknown>;
};

export const validateRawEnv = (schema: EnvSchema): ValidateRawEnvRes => {
  const result: ValidateRawEnvRes = {
    errors: [],
    warnings: [],
    variables: {},
  };

  const env: NodeJS.ProcessEnv = process.env;

  for (const key in schema) {
    const def = schema[key];
    const envRaw = env[key];

    if (def.required && (envRaw === undefined || envRaw === '')) {
      result.errors.push(`${key} is required, but value not provided`);
      continue;
    }

    if (!def.required) {
      result.warnings.push(`${key} is marked as not required, may occurs error`);
      result.variables[key] = envRaw;
      continue;
    }

    switch (def.type) {
      case 'string':
        result.variables[key] = envRaw;
        break;
      case 'number':
        if (isNaN(Number(envRaw))) {
          result.errors.push(`${key} is marked as number but number is not provided`);
        } else {
          result.variables[key] = envRaw;
        }
        break;
      case 'boolean':
        if (envRaw != 'true' && envRaw != 'false') {
          result.errors.push(`${key} is marked as boolean but boolean is not provided`);
        } else {
          result.variables[key] = envRaw;
        }
        break;
      case 'enum':
        if ('values' in def) {
          result.errors.push(`${key} is marked as enum, values not provided`);
        } else if (!def.values?.includes(envRaw!)) {
          result.errors.push(`${key} is enum, but not matched with teh values provided`);
        } else {
          result.variables[key] = envRaw;
        }
        break;
      default:
        result.errors.push(`${key} is marked as ${def.type}, ${def.type} is acceptable as a type`);
    }
  }

  return result;
};
