import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly service: ExercisesService) {}

  @Post()
  @Roles('trainer')
  create(@Body() dto: CreateExerciseDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('trainer')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('trainer')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('trainer')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExerciseDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('trainer')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
