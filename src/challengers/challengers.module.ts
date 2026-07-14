import { Module } from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { ChallengersController } from './challengers.controller';
import { ChallengerDay } from './entities/challenger-day.entity';
import { Challenger } from './entities/challenger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Challenger, ChallengerDay])],
  controllers: [ChallengersController],
  providers: [ChallengersService],
})
export class ChallengersModule {}
