import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { DEFAULT_UNAUTHORIZED_ERROR_MESSAGE } from '../../commons/const';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RoleGuard } from './guard/role.guard';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException(DEFAULT_UNAUTHORIZED_ERROR_MESSAGE);
    }
    return this.authService.signJwt(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/me')
  me(@Req() req: Request) {
    return this.authService.me(req.user as UserInterface);
  }
}
