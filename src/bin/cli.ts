#!/usr/bin/env node

import { Command } from 'commander';
import { validateEnv } from '../main';
import { logger } from '../utils/logger';
import logSymbols from 'log-symbols';
import path from 'path';
import { pathToFileURL } from 'url';

const program = new Command();

program
  .name('env-validate')
  .description('Validate environment variables using your custom schema')
  .version('1.0.0')
  .option('-s, --schema <path>', 'Path to schema file (must export EnvSchema)')
  .action(async (options) => {
    if (!options.schema) {
      logger.error(`${logSymbols.error} Please provide a schema file path using --schema <path>`);
      process.exit(1);
    }

    try {
      const fullPath = path.resolve(process.cwd(), options.schema);
      const fileUrl = pathToFileURL(fullPath).href;

      const schemaModule = await import(fileUrl);
      const schema = schemaModule.schema;

      if (!schema) {
        logger.error(`${logSymbols.error} Schema file must export a named export called "schema"`);
        process.exit(1);
      }

      validateEnv(schema);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`${logSymbols.error} Failed to load schema: ${err?.message}`);
        process.exit(1);
      } else {
        logger.error(`${logSymbols.error} Failed to load schema: unknown error occurs!}`);
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
