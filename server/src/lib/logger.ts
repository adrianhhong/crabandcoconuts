import { server as serverConfig } from '../config';
import { createLogger, format, transports } from 'winston';

/**
 * Levels:
 *
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
 */
const logger = createLogger({
  level: serverConfig.logLevel,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
      level: serverConfig.logLevel,
    }),
  ],
  exitOnError: false,
});

export default logger;
