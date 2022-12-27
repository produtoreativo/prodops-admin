import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtAccessTokenStrategy } from './strategy/jwt-access-token.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
  ],
  providers: [AuthService, JwtAccessTokenStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
