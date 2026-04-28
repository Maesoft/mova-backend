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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard) // 🔐 opcional (recomendado si es admin)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @Roles('trainer')
  create(@Body() dto: CreateCategoryDto) {
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
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('trainer')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
