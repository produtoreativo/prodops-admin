import Pino, { Logger, transport } from 'pino';
import { LoggerOptions, destination } from 'pino';
import { trace, context } from '@opentelemetry/api';

console.log('destination', process.env.LOG_FILE_NAME)

export const loggerOptions: LoggerOptions = {
  level: 'trace',
  // transport: transport({
  //   pipeline: [
  //     {
  //       target: 'pino-syslog',
  //       options: {

  //       }
  //     },
  //     {
  //       target: 'pino-socket',
  //       options: {
  //         mode: 'tcp',
  //         address: '127.0.0.1',
  //         port: 54527
  //       }
  //     }
  //   ]
  // }),
  formatters: {
    level(label) {
      return { level: label };
    },
    log(object) {
      const span = trace.getSpan(context.active());
      if (!span) return { ...object };
      const { spanId, traceId, traceFlags } = trace
        .getSpan(context.active())
        ?.spanContext();
      // span.id, trace.id, hostname, entity.guid, and entity.name
      return { 
        ...object, 
        // spanId, 
        // traceId,
        TraceId:  traceId,
        SpanId: spanId,
        TraceFlags: traceFlags,
        'trace_id':  traceId,
        'span_id': spanId,
        'trace_flags': traceFlags,
        'trace.id':  traceId,
        'span.id': spanId,
        'trace.flags': traceFlags,
      };
    },
  },
  // prettifier: 
  // // prettyPrint:
  //   process.env.NODE_ENV === 'local'
  //     ? {
  //         colorize: true,
  //         levelFirst: true,
  //         translateTime: true,
  //       }
  //     : false,
};

export const logger: Logger = Pino(
  loggerOptions,
  // destination('./glenio.log'),
);