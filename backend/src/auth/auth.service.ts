import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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

  async register(data: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Create user
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
    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate JWT
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

