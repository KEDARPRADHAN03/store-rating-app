import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async submitRating(userId: number, storeId: number, rating: number) {
    const existing = await this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
    });
    if (existing) {
      existing.rating = rating;
      return this.ratingRepository.save(existing);
    }
    const newRating = this.ratingRepository.create({
      rating,
      user: { id: userId } as any,
      store: { id: storeId } as any,
    });
    return this.ratingRepository.save(newRating);
  }

  async getUserRatingForStore(userId: number, storeId: number) {
    return this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
    });
  }

  async getStoreRatings(storeId: number) {
    return this.ratingRepository.find({
      where: { store: { id: storeId } },
      relations: { user: true },
    });
  }

  async getTotalRatings() {
    return this.ratingRepository.count();
  }
}