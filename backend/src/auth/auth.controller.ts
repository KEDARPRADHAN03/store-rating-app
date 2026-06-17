import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SignupDto {
  @IsString() @MinLength(20) @MaxLength(60) name: string;
  @IsEmail() email: string;
  @MaxLength(400) address: string;
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)
  password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

export class ChangePasswordDto {
  @IsString() oldPassword: string;
  @IsString() newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.name, dto.email, dto.password, dto.address);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
  }
}