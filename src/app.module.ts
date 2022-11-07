import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { ProductModule } from './product/product.module';

// import { OpenTelemetryModule } from 'nestjs-otel';

// const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
//   metrics: {
//     hostMetrics: true,
//     // defaultMetrics: true,
//     apiMetrics: {
//       enable: true,
//     },
//   },
// });

@Module({
  imports: [
    ConfigModule.forRoot(),
    // OpenTelemetryModuleConfig,
    LoggerModule,
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
