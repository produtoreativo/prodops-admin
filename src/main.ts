import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
// import { otelSetupInstrumentation } from './opentelemetry/tracer';
// import { default as api } from "@opentelemetry/api";
// import './opentelemetry/Tracer2';
// const api = require("@opentelemetry/api");
// import otelSDK from './opentelemetry/tracing2';


async function bootstrap() {
  
  // otelSetupInstrumentation();
  // api.diag.setLogger();
  // api.diag.setLogger(
  //   new api.DiagConsoleLogger(),
  //   api.DiagLogLevel.INFO,
  // );
  // await otelSDK.start();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
