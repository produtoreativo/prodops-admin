
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TraceService, Span } from 'nestjs-otel';
import { Cron } from '@nestjs/schedule';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly productService: ProductService,
    private readonly traceService: TraceService
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  @Cron('10 * * * * *')
  @Span()
  async handleCron(): Promise<void> {
    // const currentSpan = this.traceService.getSpan(); 
    // const currentSpan = this.traceService.getTracer().startSpan('sub_span'); 
    console.log('span')
    // console.log(currentSpan)
    this.logger.warn('Cron executado');
    const prod = await this.productService.findOne(4);
    this.logger.warn('Produto', prod.id);
    // currentSpan.end(); 
    return;
  }
}