import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async createStore(name: string, email: string, address: string, ownerId?: number) {
    const store = this.storeRepository.create({
      name, email, address,
      owner: ownerId ? { id: ownerId } as any : null,
    });
    return this.storeRepository.save(store);
  }

  async findAll(filters: any) {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating')
      .leftJoinAndSelect('store.owner', 'owner');
    if (filters.name) query.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.address) query.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters.sortBy) {
      query.orderBy(`store.${filters.sortBy}`, filters.order === 'DESC' ? 'DESC' : 'ASC');
    }
    const stores = await query.getMany();
    return stores.map(store => ({
      ...store,
      averageRating: store.ratings.length
        ? store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length
        : 0,
    }));
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
     relations: { ratings: { user: true }, owner: true },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async getTotalStores() {
    return this.storeRepository.count();
  }
}