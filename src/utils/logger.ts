const color = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
};

export const logger = {
  errorHeader: () => {
    console.error(`${color.red}[ERROR]:${color.reset}`);
  },

  error: (message: string | string[]) => {
    console.error(
      `${color.red}${Array.isArray(message) ? message.join('\n- ') : message}${color.reset}`,
    );
  },

  warnHeader: () => {
    console.log(`${color.yellow}[WARN]:${color.reset}`);
  },

  warn: (message: string | string[]) => {
    console.log(
      `${color.yellow}${Array.isArray(message) ? message.join('\n- ') : message}${color.reset}`,
    );
  },

  success: (message: string) => {
    console.log(`${color.green}${message}${color.reset}`);
  },
};
