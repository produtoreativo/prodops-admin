import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { SimpleSpanProcessor, ConsoleSpanExporter, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as process from 'process';
import { Resource } from "@opentelemetry/resources";
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import api, { DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
 
// api.diag.setLogger(
//   new DiagConsoleLogger(),
//   DiagLogLevel.DEBUG,
// );

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "prodops-agent24",
})

const exporterOptions = {
  url: 'http://localhost:4318/v1/traces'
}

const traceExporter = new OTLPTraceExporter(exporterOptions);
const provider = new NodeTracerProvider({resource});
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter))
// provider.addSpanProcessor(new BatchSpanProcessor(traceExporter, {
//   // The maximum queue size. After the size is reached spans are dropped.
//   maxQueueSize: 100,
//   // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
//   maxExportBatchSize: 10,
//   // The interval between two consecutive exports
//   scheduledDelayMillis: 500,
//   // How long the export can run before it is cancelled
//   exportTimeoutMillis: 30000,
// }));

// const consoleExporter = new ConsoleSpanExporter();
// provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));
provider.register();

// registerInstrumentations({
//   instrumentations: [
//     new PinoInstrumentation({
//       // Optional hook to insert additional context to log object.
//       logHook: (span, record, level) => {
//         record['resource.service.name'] = provider.resource.attributes['service.name'];
//       },
//     }),
//     // other instrumentations
//   ],
// });

const otelSDK = new NodeSDK({
  resource, 
  // metricExporter: new PrometheusExporter({
  //   port: 8081,
  // }),
  // metricInterval: 1000,
  // spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
  //spanProcessor: new BatchSpanProcessor(traceExporter)
  traceExporter,
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      err => console.log('Error shutting down SDK', err)
    )
    .finally(() => process.exit(0));
});

// otelSDK.start();

export default otelSDK;