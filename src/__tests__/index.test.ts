import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEnv } from '../functions/validateEnv'; // Adjust path accordingly
import { EnvSchema } from '../types';
import logSymbols from 'log-symbols';

// Mock console methods to avoid polluting test output
const logMock = vi.spyOn(console, 'log').mockImplementation(() => {});
const errorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit was called');
});

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv }; // Reset environment before each test
    logMock.mockClear();
    errorMock.mockClear();
    warnMock.mockClear();
    exitMock.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should pass for valid required string', () => {
    process.env.TEST_VAR = 'hello';
    const schema: EnvSchema = {
      TEST_VAR: { type: 'string', required: true },
    };

    const result = validateEnv(schema);
    expect(result.TEST_VAR).toBe('hello');
    expect(logMock).toHaveBeenCalled();
  });

  it('should exit for missing required variable', () => {
    const schema: EnvSchema = {
      MISSING_VAR: { type: 'string', required: true },
    };

    expect(() => validateEnv(schema)).toThrow('process.exit was called');
    expect(errorMock).toHaveBeenCalledWith(
      logSymbols.error,
      expect.stringContaining('Invalid environment configuration:'),
    );
  });

  it('should validate number type correctly', () => {
    process.env.NUM_VAR = '123';
    const schema: EnvSchema = {
      NUM_VAR: { type: 'number', required: true },
    };

    const result = validateEnv(schema);
    expect(result.NUM_VAR).toBe('123');
  });

  it('should fail for invalid number', () => {
    process.env.NUM_VAR = 'abc';
    const schema: EnvSchema = {
      NUM_VAR: { type: 'number', required: true },
    };

    expect(() => validateEnv(schema)).toThrow('process.exit was called');
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining('must be a valid number'));
  });

  it('should validate boolean type correctly', () => {
    process.env.BOOL_VAR = 'true';
    const schema: EnvSchema = {
      BOOL_VAR: { type: 'boolean', required: true },
    };

    const result = validateEnv(schema);
    expect(result.BOOL_VAR).toBe('true');
  });

  it('should fail for invalid boolean', () => {
    process.env.BOOL_VAR = 'yes';
    const schema: EnvSchema = {
      BOOL_VAR: { type: 'boolean', required: true },
    };

    expect(() => validateEnv(schema)).toThrow('process.exit was called');
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining("must be 'true' or 'false'"));
  });

  it('should validate enum correctly', () => {
    process.env.ENV_TYPE = 'production';
    const schema: EnvSchema = {
      ENV_TYPE: {
        type: 'enum',
        required: true,
        values: ['development', 'production', 'staging'],
      },
    };

    const result = validateEnv(schema);
    expect(result.ENV_TYPE).toBe('production');
  });

  it('should fail for invalid enum value', () => {
    process.env.ENV_TYPE = 'invalid';
    const schema: EnvSchema = {
      ENV_TYPE: {
        type: 'enum',
        required: true,
        values: ['development', 'production'],
      },
    };

    expect(() => validateEnv(schema)).toThrow('process.exit was called');
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining('must be one of'));
  });

  it('should warn for non-required variables', () => {
    process.env.OPTIONAL_VAR = 'optional';
    const schema: EnvSchema = {
      OPTIONAL_VAR: { type: 'string', required: false },
    };

    const result = validateEnv(schema);
    expect(result.OPTIONAL_VAR).toBe('optional');
    expect(logMock).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('[WARN]:'));
  });
});
