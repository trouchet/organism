import { createLogger, format, transports, config } from 'winston';
import { now_epoch } from './utils.js';

const { combine, timestamp, label, printf } = format;

const log_format = printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  }
);

/*
  We may define our own logging level. The default are given below 
  by property config.syslog.levels
  const my_levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };
*/
export const logger = (label_msg = "default") => {
  return createLogger({
    format: combine(
      format.colorize(),
      label({ label: label_msg }),
      timestamp(),
      log_format
    ),
    transports: [
      new transports.Console(),
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new transports.File({ filename: `./logs/error_${now_epoch()}.log`, level: 'error' }),
      new transports.File({ filename: `./logs/combined_${now_epoch()}.log` }),
    ],
    exceptionHandlers: [
    new transports.File({ filename: `./logs/exceptions_${now_epoch()}.log` })
    ],
    exitOnError: false, 
  })
};

export const log_message = (logger, level, message) => {
  logger.log({
    level: level,
    message: message
  });
}