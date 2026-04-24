import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateRoutineBlockExerciseDto } from './create-routine-block-exercise.dto';

export class CreateRoutineBlockDto {
  @IsInt()
  @Min(1)
  day!: number;

  @IsInt()
  @Min(1)
  order!: number;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineBlockExerciseDto)
  @ArrayMinSize(1)
  exercises!: CreateRoutineBlockExerciseDto[];
}
