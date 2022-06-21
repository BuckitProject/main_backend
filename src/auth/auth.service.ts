import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneByPhoneNumber(phoneNumber);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(input: LoginInput) {
    const user = await this.userService.findOneByPhoneNumber(input.phoneNumber);
    const payloads = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payloads),
    };
  }
}
