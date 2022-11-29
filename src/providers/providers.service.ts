import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  create(createProviderDto: CreateProviderDto) {
    return this.providersRepository.save(createProviderDto);
  }

  findAll() {
    return this.providersRepository.find();
  }

  findOne(id: number) {
    return this.providersRepository.findOneBy({ id });
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return this.providersRepository.update(id, updateProviderDto);
  }

  remove(id: number) {
    return this.providersRepository.delete(id);
  }
}
