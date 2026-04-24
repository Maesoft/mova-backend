import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from './entities/routine.entity';
import { RoutineBlock } from './entities/routine-block.entity';
import { RoutineBlockExercise } from './entities/routine-block-exercise.entity';

import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Routine,
      RoutineBlock,
      RoutineBlockExercise,
      User,
    ]),
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
