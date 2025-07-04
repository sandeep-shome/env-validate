import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';

// Path to compiled CLI
const cliPath = path.resolve(__dirname, '../dist/bin/cli.js');

const tempDir = path.resolve(__dirname, '../temp');
const schemaPath = path.join(tempDir, 'temp-schema.js');

// Create schema code
const schemaContent = `
   module.exports.schema = {
    TEST_ENV: { type: "string", required: true }
  };
`;

describe('CLI: env-validate', () => {
  beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    fs.writeFileSync(schemaPath, schemaContent, 'utf-8');
  });

  // After test: clean up
  afterAll(() => {
    fs.unlinkSync(schemaPath);
    fs.rmdirSync(tempDir);
  });

  it('should show error if required env is missing', async () => {
    const { stderr, exitCode } = await execa('node', [cliPath, '--schema', schemaPath], {
      env: {}, // simulate empty .env
      reject: false, // don’t throw on non-zero exit
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain('TEST_ENV is required');
  });

  it('should pass if env is correctly set', async () => {
    const { stdout, exitCode } = await execa('node', [cliPath, '--schema', schemaPath], {
      env: { TEST_ENV: 'hello' },
    });

    expect(exitCode).toBe(0);
    expect(stdout).toContain('env variables are setup');
  });
});
