import { validateRawEnv } from './functions/validateRawEnv';
import { EnvSchema } from './types/types';
import { logger } from './utils/logger';

export const validateEnv = <T extends EnvSchema>(
  schema: T,
): Record<string, unknown> | undefined => {
  const res = validateRawEnv(schema);

  if (res.warnings.length > 0) {
    logger.warnHeader();
    logger.warn(res.warnings);
  }

  if (res.errors.length === 0) {
    logger.success('env variables are setup');
    return res.variables;
  } else {
    logger.errorHeader();
    logger.error(res.errors);
    process.exit(1);
  }
};
