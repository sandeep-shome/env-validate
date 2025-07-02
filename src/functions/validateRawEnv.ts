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
      result.warnings.push(`${key} is marked as not required; it may cause unexpected behavior.`);
      result.variables[key] = envRaw;
      continue;
    }

    switch (def.type) {
      case 'string':
        result.variables[key] = envRaw;
        break;
      case 'number':
        if (isNaN(Number(envRaw))) {
          result.errors.push(`${key} is expected to be a number, but got "${envRaw}"`);
        } else {
          result.variables[key] = envRaw;
        }
        break;
      case 'boolean':
        if (envRaw != 'true' && envRaw != 'false') {
          result.errors.push(`${key} must be either "true" or "false", but got "${envRaw}"`);
        } else {
          result.variables[key] = envRaw;
        }
        break;
      case 'enum':
        if (!('values' in def) || !def.values || def.values.length === 0) {
          result.errors.push(`${key} is marked as enum, but no values were provided.`);
        } else if (!def.values.includes(envRaw!)) {
          result.errors.push(
            `${key} must be one of: ${def.values.join(', ')}, but got "${envRaw}"`,
          );
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
