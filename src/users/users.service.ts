import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async createOne(registerUserDto: RegisterUserDto) {
    try {
      const { salt, key } = this.getSaltAndKey(registerUserDto.password);
      return this.usersRepository.save(
        this.usersRepository.create({
          name: registerUserDto.name,
          email: registerUserDto.email,
          key,
          salt,
        }),
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
  async validate(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { salt, key, ...others } = user;

    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    if (hash.toString('hex') !== key) {
      throw new UnauthorizedException();
    }
    return others as UserEntity;
  }
  private getSaltAndKey(password) {
    const salt = crypto.randomUUID();
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    const key = hash.toString('hex');
    return { salt, key };
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
      return null;
    }
    return user;
  }
  async listOrganizationsOfUser(userId: number) {
    const { organizations } = await this.findById(userId);
    return organizations;
  }
}
