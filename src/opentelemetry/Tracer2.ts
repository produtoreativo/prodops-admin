"use strict";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { v4 as uuidv4 } from 'uuid';
import opentelemetry from "@opentelemetry/sdk-node";
import process from 'process';
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

// const { v4: uuidv4 } = require("uuid");
// const process = require("process");
// const opentelemetry = require("@opentelemetry/sdk-node");
// const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { Resource } = require("@opentelemetry/resources");
// const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
// const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
// const api = require("@opentelemetry/api");

// enable logging ONLY for developement
// this is useful for debugging instrumentation issues
// remove from production after issues (if any) are resolved
// view more logging levels here: https://github.com/open-telemetry/opentelemetry-js-api/blob/main/src/diag/types.ts#L67
// api.diag.setLogger(
//   new api.DiagConsoleLogger(),
//   api.DiagLogLevel.DEBUG,
// );

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "prodops-prod2",
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: uuidv4(),
});

// Step 2: Enable auto-instrumentation from the meta package.
const instrumentations = [getNodeAutoInstrumentations()];
const traceExporter = new OTLPTraceExporter();

// // Step 4: Configure the OpenTelemetry NodeSDK to export traces.
const sdk = new opentelemetry.NodeSDK({
  resource,
  traceExporter,
  instrumentations,
});

// Step 5: Initialize the SDK and register with the OpenTelemetry API:
//    this enables the API to record telemetry
sdk
  .start()
  .then(() => console.log("Tracing initialized"))
  .catch((error) => console.log("Error initializing tracing", error));

// Step 6: Gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});