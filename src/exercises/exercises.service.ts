import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private repo: Repository<Exercise>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateExerciseDto): Promise<Exercise> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no existe');
    }

    const exercise = this.repo.create({
      ...dto,
      category,
    });

    return this.repo.save(exercise);
  }

  async findAll(): Promise<Exercise[]> {
    return this.repo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.repo.findOne({ where: { id } });
    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }
    return exercise;
  }

  async update(id: number, dto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findOne(id);
    const merged = this.repo.merge(exercise, dto);
    return this.repo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const exercise = await this.findOne(id);
    await this.repo.remove(exercise);
  }
}
