// Supported primitive types for environment variables
export type EnvVarType = 'string' | 'number' | 'boolean' | 'enum';

// Validation rules for a single environment variable
export type EnvVarDefinition = {
  type: EnvVarType;
  required: boolean;
  values?: string[]; // only used when type is 'enum'
};

// The full schema for all environment variables
export interface EnvSchema {
  [key: string]: EnvVarDefinition;
}

// Represents validated values
export type ValidVars = Record<string, string | undefined>;
