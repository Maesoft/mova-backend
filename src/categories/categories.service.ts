import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestException('La categoría ya existe');
    }

    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.repo.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name) {
      const exists = await this.repo.findOne({
        where: { name: dto.name },
      });

      if (exists && exists.id !== id) {
        throw new BadRequestException('La categoría ya existe');
      }
    }

    const merged = this.repo.merge(category, dto);
    return this.repo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.repo.remove(category);
  }
}
