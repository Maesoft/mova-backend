import { Type } from 'class-transformer';
import { IsString, ValidateNested, ArrayMinSize, IsInt } from 'class-validator';
import { CreateRoutineDayDto } from './create-routine-day.dto';

export class CreateRoutineDto {
  @IsString()
  name!: string;

  @IsInt()
  trainerId!: number;

  @ValidateNested({ each: true })
  @Type((): new () => CreateRoutineDayDto => CreateRoutineDayDto)
  @ArrayMinSize(1)
  days!: CreateRoutineDayDto[];
}
