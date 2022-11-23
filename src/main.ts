// const newrelic = require('newrelic')
// require('newrelic');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

import otelSDK from './opentelemetry/tracing2';

async function bootstrap() {
  otelSDK.start().then(async function() {
    console.log("Carregou o optel")
    const app = await NestFactory.create(AppModule, {  });
    console.log("Crio o app do nestjs")
    app.useLogger(app.get(Logger));
    await app.listen(3000);
    console.log("Carregou o nestjs")
  });
}
bootstrap();
