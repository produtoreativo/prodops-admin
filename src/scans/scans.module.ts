import { Module } from '@nestjs/common';
import { ScansService } from './scans.service';
import { ScansController } from './scans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scan } from './entities/scan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scan])
  ],
  controllers: [ScansController],
  providers: [ScansService]
})
export class ScansModule {}
