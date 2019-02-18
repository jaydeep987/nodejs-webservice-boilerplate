import { createLogger, format, transports } from 'winston';
import { EnvVars, config } from '~common/config';

const { combine, label, timestamp, prettyPrint } = format;

const logger = createLogger({
  format: combine(label(), timestamp(), prettyPrint()),
  transports: [
    new transports.File({
      filename: config.get(EnvVars.LOG_FILE_NAME),
      format: format.json(),
    }),
  ],
});

if (config.get(EnvVars.NODE_ENV) === 'development') {
  logger.add(new transports.Console({ format: format.simple() }));
}

/** Gives formatted prefix for message */
function getFormattedPrefix(prefix: string): string {
  if (!prefix) {
    return '';
  }

  return `[${prefix}] `;
}

/**
 * Constructs message with prefix and extra info
 */
function getMessage(options: LogParams): string {
  const { message, extraInfo, prefix } = options;
  const formattedPrefix: string = getFormattedPrefix(prefix);
  const info: string = typeof extraInfo === 'object' ? JSON.stringify(extraInfo) : extraInfo;

  return `${formattedPrefix}${message} ${!info ? '' : info}`;
}

/**
 * Logging utility
 */
const Logger = {
  info: (options: LogParams) => {
    logger.info(getMessage(options));
  },
  error: (options: LogParams) => {
    logger.error(getMessage(options));
  },
  warn: (options: LogParams) => {
    logger.warn(getMessage(options));
  },
  debug: (options: LogParams) => {
    logger.debug(getMessage(options));
  },
};

export interface LogParams {
  /** Required message to log */
  message: string;
  /** Extra info, in case of object it will be jsonified! */
  extraInfo?: string | object;
  /** Prefix to attach before message */
  prefix?: string;
}

export { Logger };
