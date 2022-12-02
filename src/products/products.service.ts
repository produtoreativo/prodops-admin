import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

import { Logger } from '@nestjs/common';
// import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>, // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    // this.logger.setContext(ProductService.name);
  }

  private readonly logger = new Logger(ProductsService.name);

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.save(createProductDto);
    //capturar este evento
    console.log('Product ID', product.id);
    return product;
  }

  findAll() {
    throw new Error('Erro provocado');
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ id });
    //capturar este evento
    this.logger.warn('******************************************');
    // console.warn('******************************************');
    this.logger.warn('Product ID', product.id);
    //  console.warn('Product ID', product.id);
    this.logger.warn('******************************************');
    // console.warn('******************************************');
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
