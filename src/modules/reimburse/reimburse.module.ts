import { Module } from '@nestjs/common';
import { ReimburseService } from './reimburse.service';
import { ReimburseController } from './reimburse.controller';

@Module({
  controllers: [ReimburseController],
  providers: [ReimburseService],
})
export class ReimburseModule {}
