import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './user.entity';
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString() @MinLength(20) @MaxLength(60) name: string;
  @IsEmail() email: string;
  @MaxLength(400) address: string;
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)
  password: string;
  @IsEnum(UserRole) role: UserRole;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto.name, dto.email, dto.password, dto.address, dto.role);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}