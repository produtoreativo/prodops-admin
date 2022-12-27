import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserEntity } from '../users/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAccessTokenAuthGuard } from './guard/jwt-access.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserEntity> {
    return this.authService.register(registerUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(
    @Body() loginDto: LoginUserDto,
    @GetUser() user: UserEntity,
    @Res() response: Response,
  ) {
    const { refreshToken, refreshTokenExpirationCookieData, ...payload } =
      await this.authService.getUserPayload(user);
    response.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${refreshTokenExpirationCookieData}`,
    );
    return response.json(payload);
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const { refreshToken } = request.cookies;
    if (!refreshToken) throw new BadRequestException();
    const {
      refreshToken: newRefreshToken,
      refreshTokenExpirationCookieData,
      ...payload
    } = await this.authService.handleRefreshTokens(refreshToken);
    response.setHeader(
      'Set-Cookie',
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${refreshTokenExpirationCookieData}`,
    );
    return response.json(payload);
  }

  @UseGuards(JwtAccessTokenAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: Request) {
    request.res.setHeader('Authorization', '');
    request.res.setHeader(
      'Set-Cookie',
      'refreshToken=; HttpOnly; Path=/; Max-Age=0',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenAuthGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  authenticate(@GetUser() user: UserEntity): UserEntity {
    return user;
  }
}
