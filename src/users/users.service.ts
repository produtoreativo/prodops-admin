import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async createOne(registerUserDto: RegisterUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(registerUserDto),
    );
  }
  async findById(id: number) {
    const user = await this.usersRepository.findOne(id, {
      relations: ['organizations'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async listOrganizationsOfUser(userId: number) {
    const { organizations } = await this.findById(userId);
    return organizations;
  }
}
