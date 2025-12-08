import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { Ward } from './ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ward])],
  controllers: [WardsController],
  providers: [WardsService],
  exports: [WardsService],
})
export class WardsModule {}
