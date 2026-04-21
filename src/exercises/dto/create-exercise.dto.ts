import { IsNumber, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsNumber()
  categoryId!: number;
}
