import { Type } from 'class-transformer';
import { IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateRoutineBlockDto } from './create-routine-block.dto';

export class CreateRoutineDayDto {
  @IsInt()
  dayNumber!: number;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineBlockDto)
  @ArrayMinSize(1)
  blocks!: CreateRoutineBlockDto[];
}
