import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from './entities/routine.entity';
import { RoutineDay } from './entities/routine-day.entity';
import { RoutineBlock } from './entities/routine-block.entity';
import { RoutineExercise } from './entities/routine-exercise.entity';

import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { User } from '../users/user.entity';
import { UserRoutine } from './entities/user-routine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Routine,
      RoutineDay,
      RoutineBlock,
      RoutineExercise,
      User,
      UserRoutine,
    ]),
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
