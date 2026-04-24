import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateRoutineBlockExerciseDto {
  @IsInt()
  exerciseId!: number;

  @IsInt()
  @Min(1)
  sets!: number;

  @IsInt()
  @Min(1)
  reps!: number;

  @IsOptional()
  @IsInt()
  restSeconds?: number;

  @IsInt()
  @Min(1)
  order!: number;
}
