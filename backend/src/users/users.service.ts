import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(name: string, email: string, password: string, address: string, role: UserRole) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ name, email, password: hashed, address, role });
    return this.userRepository.save(user);
  }

  async findAll(filters: any) {
    const query = this.userRepository.createQueryBuilder('user');
    if (filters.name) query.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.email) query.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    if (filters.address) query.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters.role) query.andWhere('user.role = :role', { role: filters.role });
    if (filters.sortBy) {
      query.orderBy(`user.${filters.sortBy}`, filters.order === 'DESC' ? 'DESC' : 'ASC');
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { ratings: { store: true } } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getTotalUsers() {
    return this.userRepository.count();
  }
}