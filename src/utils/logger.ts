import logSymbols from 'log-symbols';

const color = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
};

export const logger = {
  error: (message: string | string[]) => {
    console.error(
      `${color.red}${logSymbols.error} ${Array.isArray(message) ? message.join('\n- ') : message}${color.reset}`,
    );
  },

  warn: (message: string | string[]) => {
    console.log(
      `${color.yellow}${logSymbols.warning} ${Array.isArray(message) ? message.join('\n- ') : message}${color.reset}`,
    );
  },

  success: (message: string) => {
    console.log(`${color.green}${logSymbols.success} ${message}${color.reset}`);
  },
};
