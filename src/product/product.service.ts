import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.save(createProductDto);
    //capturar este evento
    console.log('Product ID', product.id);
    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    //capturar este evento
    console.log('Product ID', product.id);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
