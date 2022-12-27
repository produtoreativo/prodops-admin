import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { addDays, isAfter } from 'date-fns';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { TokenEntity, TokenType } from './token.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    try {
      return this.usersRepository.save(
        this.usersRepository.create(registerUserDto),
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleRefreshTokens(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        token: refreshToken,
        type: TokenType.REFRESH_TOKEN,
      },
      relations: ['user'],
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    const isValid = isAfter(token.expiresAt, new Date());
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return this.getUserPayload(token.user);
  }

  async getUserPayload(user: UserEntity) {
    const jwtExpTime = parseInt(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      10,
    );
    const expiresIn = jwtExpTime * 60 * 1000; // milliseconds
    const { refreshToken, refreshTokenExpirationCookieData } =
      await this.generateRefreshToken(user);
    return {
      accessToken: this.generateJwtToken({
        accountId: user.id,
      }),
      refreshToken,
      refreshTokenExpirationCookieData,
      expiresIn,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  private async generateRefreshToken(user: UserEntity) {
    const jwtRefreshTokenExpTime = parseInt(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      10,
    );
    const plainTextToken = this.generateRandomToken(48);
    await this.tokenRepository.save(
      this.tokenRepository.create({
        user: user,
        token: plainTextToken,
        type: TokenType.REFRESH_TOKEN,
        expiresAt: addDays(new Date(), jwtRefreshTokenExpTime),
      }),
    );
    // in seconds
    const refreshTokenExpirationCookieData =
      60 * 60 * 24 * jwtRefreshTokenExpTime;
    return { refreshToken: plainTextToken, refreshTokenExpirationCookieData };
  }
  private generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  private generateJwtToken(payload: { accountId: number }) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}m`,
    });
  }

  public async getAuthenticatedAccount(
    email: string,
    plainTextPassword: string,
  ) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
