import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {

    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingMobile = await this.userService.findByMobileNumber(dto.mobileNumber);

    if (existingMobile) {
      throw new ConflictException('Mobile number is already registered.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        mobileNumber: dto.mobileNumber,
        email: email,
        password: hashedPassword,
        role: Role.USER,
      });

  const { password, ...result } = user;

  return {
    message: 'Registration successful',
    user: result,
  };

  }

  private async validateUser(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userService.findByEmail(normalizedEmail);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
