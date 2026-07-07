import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNutritionDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  image!: string;

  @IsOptional()
  published?: boolean;

  @IsOptional()
  active?: boolean;
}
