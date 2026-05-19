import { Type } from 'class-transformer';
import { IsString, IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateRoutineExerciseDto } from './create-routine-exercise.dto';

export class CreateRoutineBlockDto {
  @IsString()
  name!: string;

  @IsInt()
  order!: number;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  @ArrayMinSize(1)
  exercises!: CreateRoutineExerciseDto[];
}
