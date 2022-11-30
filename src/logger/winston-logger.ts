import winston from 'winston';
1;
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  // level: 'info',
  format: format.combine(
    // format.colorize(),
    format.json(),
  ),
  defaultMeta: { service: 'prodops-prod' },
  transports: [new transports.Console()],
  // transports: [
  //   //
  //   // - Write all logs with importance level of `error` or less to `error.log`
  //   // - Write all logs with importance level of `info` or less to `combined.log`
  //   //
  //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
  //   new winston.transports.File({ filename: 'combined.log' }),
  // ],
});

export default logger;
