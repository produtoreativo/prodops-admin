import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { v4 as uuidv4 } from 'uuid';

// Traces
import {
  ConsoleSpanExporter,
  BasicTracerProvider,
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const OpenTelemetry = require('@opentelemetry/sdk-node');
// const api = require("@opentelemetry/api");

// view more logging levels here: https://github.com/open-telemetry/opentelemetry-js-api/blob/main/src/diag/types.ts#L67
// api.diag.setLogger(
//   new api.DiagConsoleLogger(),
//   api.DiagLogLevel.INFO,
// );

export const OTEL_SERVICE_RESOURCE = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'otel-express-node-2',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: uuidv4(),
});

const traceExporter = new OTLPTraceExporter();

export function registerTraceProvider() {
  const provider = new NodeTracerProvider({ resource: OTEL_SERVICE_RESOURCE });
  // const consoleExporter = new ConsoleSpanExporter();
  // provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));
  // provider.register();
  // const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter)
  provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
  provider.register();
}

export async function otelSetupInstrumentation() {
  registerTraceProvider();
  const sdk = new OpenTelemetry.NodeSDK({
    resource: OTEL_SERVICE_RESOURCE,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  console.log(
    'OTEL_EXPORTER_OTLP_ENDPOINT',
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  );
  sdk
    .start()
    .then(() => console.log('Tracing initialized'))
    .catch((error) => console.log('Error initializing tracing', error));

  // Step 6: Gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
}
