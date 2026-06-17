import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string, address: string) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name, email, password: hashed, address, role: UserRole.USER,
    });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token, role: user.role, userId: user.id };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new UnauthorizedException('Old password is incorrect');
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }
}