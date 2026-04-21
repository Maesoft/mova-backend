import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './exercise.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Category])],
  providers: [ExercisesService],
  controllers: [ExercisesController],
  exports: [ExercisesService], // útil si después lo usás en rutinas
})
export class ExercisesModule {}
