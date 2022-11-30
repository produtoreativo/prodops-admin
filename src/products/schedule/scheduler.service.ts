import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TraceService, Span } from 'nestjs-otel';
import { Cron } from '@nestjs/schedule';
import { ProductsService } from 'src/products/products.service';
// const newrelic = require('newrelic')

@Injectable()
export class SchedulerService {
  constructor(
    private readonly productsService: ProductsService, // private readonly traceService: TraceService
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  @Cron('10 * * * * *')
  @Span()
  async handleCron(): Promise<void> {
    // newrelic.startBackgroundTransaction('Background task', function executeTransaction() {
    // const backgroundHandle = newrelic.getTransaction()
    // // Link the nested transaction by accepting the payload with the background transaction's handle
    // // backgroundHandle.acceptDistributedTracePayload(jsonPayload)
    // newrelic.startSegment('myCustomSegment', false, function timedFunction() {
    //     // const currentSpan = this.traceService.getSpan();
    //     // const currentSpan = this.traceService.getTracer().startSpan('sub_span');
    //     console.log('span')
    //     // console.log(currentSpan)

    //     this.logger.warn('Cron executado');
    //     const prod = this.productService.findOne(4);
    //     this.logger.warn('Produto', prod.id);
    //     // currentSpan.end();

    //   // End the transactions
    //   backgroundHandle.end()
    // })
    // })
    this.logger.warn('Cron executado');
    const prod = await this.productsService.findOne(4);
    this.logger.warn('Produto', prod.id);

    return;
  }
}
