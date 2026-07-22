import { IsInt, Min } from 'class-validator';

export class CreateChallengerDto {
  @IsInt()
  @Min(1)
  routineId!: number;
}
