import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Nutrition } from './entities/nutrition.entity';
import { CreateNutritionDto } from './dto/create-nutrition.dto';
import { UpdateNutritionDto } from './dto/update-nutrition.dto';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(Nutrition)
    private readonly nutritionRepository: Repository<Nutrition>,
  ) {}

  async create(createNutritionDto: CreateNutritionDto) {
    const nutrition = this.nutritionRepository.create(createNutritionDto);

    return await this.nutritionRepository.save(nutrition);
  }

  async findAll() {
    return await this.nutritionRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findPublished() {
    const nutrition = await this.nutritionRepository.findOne({
      where: {
        published: true,
        active: true,
      },
    });

    if (!nutrition) {
      throw new NotFoundException('No hay ninguna receta publicada.');
    }

    return nutrition;
  }

  async findOne(id: string) {
    const nutrition = await this.nutritionRepository.findOne({
      where: { id },
    });

    if (!nutrition) {
      throw new NotFoundException('Receta no encontrada.');
    }

    return nutrition;
  }

  async update(id: string, updateNutritionDto: UpdateNutritionDto) {
    const nutrition = await this.findOne(id);

    Object.assign(nutrition, updateNutritionDto);

    return await this.nutritionRepository.save(nutrition);
  }

  async publish(id: string) {
    const nutrition = await this.findOne(id);

    const published = await this.nutritionRepository.findOne({
      where: {
        published: true,
      },
    });

    if (published) {
      published.published = false;
      await this.nutritionRepository.save(published);
    }

    nutrition.published = true;

    return await this.nutritionRepository.save(nutrition);
  }

  async remove(id: string) {
    const nutrition = await this.findOne(id);

    await this.nutritionRepository.remove(nutrition);

    return {
      message: 'Receta eliminada correctamente.',
    };
  }
}
