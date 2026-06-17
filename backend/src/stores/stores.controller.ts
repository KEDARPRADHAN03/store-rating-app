import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  @IsString() @MinLength(20) @MaxLength(60) name: string;
  @IsEmail() email: string;
  @MaxLength(400) address: string;
  @IsOptional()
  @Type(() => Number)
  ownerId?: number;
}

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.createStore(dto.name, dto.email, dto.address, dto.ownerId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.storesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }
}