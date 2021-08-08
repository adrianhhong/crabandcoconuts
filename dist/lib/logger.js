"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const winston_1 = require("winston");
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
const logger = winston_1.createLogger({
    level: config_1.server.logLevel,
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console({
            stderrLevels: ['error'],
            level: config_1.server.logLevel,
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
