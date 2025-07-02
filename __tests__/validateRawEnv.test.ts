import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateRawEnv } from '../src/functions/validateRawEnv';
import { EnvSchema } from '../src/types/types';

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('validateRawEnv', () => {
  it('should return an error if a required variable is missing', () => {
    const schema: EnvSchema = {
      REQUIRED_KEY: { type: 'string', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain('REQUIRED_KEY is required, but value not provided');
    expect(result.variables).toEqual({});
  });

  it('should return a warning if variable is not required', () => {
    process.env.OPTIONAL_KEY = 'abc';

    const schema: EnvSchema = {
      OPTIONAL_KEY: { type: 'string', required: false },
    };

    const result = validateRawEnv(schema);

    expect(result.warnings).toContain(
      'OPTIONAL_KEY is marked as not required; it may cause unexpected behavior.',
    );
    expect(result.variables).toEqual({ OPTIONAL_KEY: 'abc' });
    expect(result.errors.length).toBe(0);
  });

  it('should validate a valid number variable', () => {
    process.env.PORT = '3000';

    const schema: EnvSchema = {
      PORT: { type: 'number', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors.length).toBe(0);
    expect(result.variables).toEqual({ PORT: '3000' }); // still string unless you cast
  });

  it('should return an error for invalid number', () => {
    process.env.PORT = 'abc';

    const schema: EnvSchema = {
      PORT: { type: 'number', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain('PORT is expected to be a number, but got "abc"');
  });

  it('should validate a valid boolean variable', () => {
    process.env.DEBUG = 'false';

    const schema: EnvSchema = {
      DEBUG: { type: 'boolean', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors.length).toBe(0);
    expect(result.variables).toEqual({ DEBUG: 'false' });
  });

  it('should return an error for invalid boolean', () => {
    process.env.DEBUG = 'maybe';

    const schema: EnvSchema = {
      DEBUG: { type: 'boolean', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain('DEBUG must be either "true" or "false", but got "maybe"');
    expect(result.variables).toEqual({});
  });

  it('should return error if enum values are missing', () => {
    process.env.MODE = 'production';

    const schema: EnvSchema = {
      MODE: { type: 'enum', required: true }, // no `values`
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain('MODE is marked as enum, but no values were provided.');
    expect(result.variables).toEqual({});
  });

  it('should return error if enum value is invalid', () => {
    process.env.MODE = 'test';

    const schema: EnvSchema = {
      MODE: { type: 'enum', required: true, values: ['development', 'production'] },
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain('MODE must be one of: development, production, but got "test"');
    expect(result.variables).toEqual({});
  });

  it('should succeed with valid enum value', () => {
    process.env.MODE = 'production';

    const schema: EnvSchema = {
      MODE: { type: 'enum', required: true, values: ['development', 'production'] },
    };

    const result = validateRawEnv(schema);

    expect(result.errors.length).toBe(0);
    expect(result.variables).toEqual({ MODE: 'production' });
  });

  it('should handle unknown type with error', () => {
    process.env.UNKNOWN = 'value';

    const schema: EnvSchema = {
      UNKNOWN: { type: 'mystery', required: true },
    };

    const result = validateRawEnv(schema);

    expect(result.errors).toContain(
      'UNKNOWN is marked as mystery, mystery is acceptable as a type',
    );
  });
});
