import { IsInt, IsString } from 'class-validator';

export class CreateRoutineExerciseDto {
  @IsInt()
  exerciseId!: number;

  @IsString()
  instructions!: string;

  @IsInt()
  order!: number;
}
