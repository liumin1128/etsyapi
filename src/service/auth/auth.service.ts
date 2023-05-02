import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../../users/users.service';

export interface SignUserPayload {
  _id: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verify(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  async login(user: SignUserPayload): Promise<string> {
    return this.jwtService.sign(user);
  }
}
