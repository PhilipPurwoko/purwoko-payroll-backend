import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findOne(loginDto.email, false);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }

  signJwt(user: User) {
    return {
      access_token: this.jwtService.sign(<UserInterface>{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    };
  }

  me(user: UserInterface) {
    return this.userService.findOne(user.id, true);
  }
}
