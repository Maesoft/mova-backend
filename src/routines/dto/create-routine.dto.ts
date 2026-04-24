import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsInt,
} from 'class-validator';
import { CreateRoutineBlockDto } from './create-routine-block.dto';

export class CreateRoutineDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  level!: string;

  @IsInt()
  trainerId!: number;

  @IsArray()
  @IsInt({ each: true })
  assignedToIds!: number[];

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineBlockDto)
  @ArrayMinSize(1)
  blocks!: CreateRoutineBlockDto[];
}
