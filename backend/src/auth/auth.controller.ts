import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() data: import('./dto/login.dto').LoginDto) {
    return this.authService.login(data);
  }
}
