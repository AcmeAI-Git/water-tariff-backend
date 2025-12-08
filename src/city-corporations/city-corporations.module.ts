import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityCorporationsController } from './city-corporations.controller';
import { CityCorporationsService } from './city-corporations.service';
import { CityCorporation } from './city-corporation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityCorporation])],
  controllers: [CityCorporationsController],
  providers: [CityCorporationsService],
  exports: [CityCorporationsService],
})
export class CityCorporationsModule {}
