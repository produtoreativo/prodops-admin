import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { LoggerModule } from 'nestjs-pino';
// import { OpenTelemetryModule } from 'nestjs-otel';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
// import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor, BatchSpanProcessor} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

// const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
//   metrics: {
//     hostMetrics: true, // Includes Host Metrics
//     apiMetrics: {
//       enable: true, // Includes api metrics
//       defaultAttributes: {
//         // You can set default labels for api metrics
//         custom: 'label',
//       },
//       ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
//       ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
//     },
//   },
// });

const exporterOptions = {
  url: 'https://otlp.nr-data.net:4317',
  headers: {
    'api-key': "ebd28325141a2db1bc1fbf558f57190846f8NRAL"
   }
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    OpenTelemetryModule.forRoot({
      serviceName: 'nestjs-opentelemetry-example4',
      spanProcessor: new BatchSpanProcessor(traceExporter),
    }),
    // OpenTelemetryModuleConfig,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
      logging: true,
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
