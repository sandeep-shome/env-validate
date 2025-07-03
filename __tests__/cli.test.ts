import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import path from 'path';

// Path to compiled CLI
const cliPath = path.resolve(__dirname, '../dist/bin/cli.js');
const schemaPath = path.resolve(__dirname, '../temp/temp-schema.js');

describe('CLI: env-validate', () => {
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
