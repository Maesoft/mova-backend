import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengerDto } from './create-challenger.dto';

export class UpdateChallengerDto extends PartialType(CreateChallengerDto) {}
