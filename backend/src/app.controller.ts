import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { StoresService } from './stores/stores.service';
import { RatingsService } from './ratings/ratings.service';

@Controller()
export class AppController {
  constructor(
    private usersService: UsersService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboard() {
    const [users, stores, ratings] = await Promise.all([
      this.usersService.getTotalUsers(),
      this.storesService.getTotalStores(),
      this.ratingsService.getTotalRatings(),
    ]);
    return { totalUsers: users, totalStores: stores, totalRatings: ratings };
  }
}