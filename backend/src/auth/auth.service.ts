import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async verifyCaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
      );
      return response.data.success;
    } catch {
      return false;
    }
  }

  async register(data: RegisterDto) {
    // Check if user already exists
    const captchaValid = await this.verifyCaptcha(data.captcha);
    if (!captchaValid) {
      throw new UnauthorizedException('Captcha verification failed');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Create user
    // Remove captcha from data before user creation
    const { captcha, ...rest } = data;
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    return user;
  }

  async login(data: LoginDto) {
    const captchaValid = await this.verifyCaptcha(data.captcha);
    if (!captchaValid) {
      throw new UnauthorizedException('Captcha verification failed');
    }
    // Remove captcha from data before using for login
    const { captcha, ...rest } = data;
    const user = await this.prisma.user.findUnique({ where: { email: rest.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(rest.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

