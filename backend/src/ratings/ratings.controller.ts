import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNumber, Min, Max } from 'class-validator';

export class SubmitRatingDto {
  @IsNumber() storeId: number;
  @IsNumber() @Min(1) @Max(5) rating: number;
}

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  submit(@Request() req: any, @Body() dto: SubmitRatingDto) {
    return this.ratingsService.submitRating(req.user.id, dto.storeId, dto.rating);
  }

  @Get('store/:storeId')
  getStoreRatings(@Param('storeId') storeId: string) {
    return this.ratingsService.getStoreRatings(+storeId);
  }

  @Get('store/:storeId/my')
  getMyRating(@Request() req: any, @Param('storeId') storeId: string) {
    return this.ratingsService.getUserRatingForStore(req.user.id, +storeId);
  }
}