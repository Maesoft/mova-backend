import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Challenger } from './entities/challenger.entity';
import { Routine } from '../routines/entities/routine.entity';
import { CreateChallengerDto } from './dto/create-challenger.dto';

@Injectable()
export class ChallengersService {
  constructor(
    @InjectRepository(Challenger)
    private readonly challengerRepository: Repository<Challenger>,

    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async create(createChallengerDto: CreateChallengerDto): Promise<Challenger> {
    const { routineId } = createChallengerDto;

    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
    });

    if (!routine) {
      throw new NotFoundException('La rutina no existe.');
    }

    const challenger = this.challengerRepository.create({
      routine,
    });

    return await this.challengerRepository.save(challenger);
  }

  async findPublished(): Promise<Challenger> {
    const challenger = await this.challengerRepository.findOne({
      where: { published: true },
      relations: {
        routine: true,
      },
    });

    if (!challenger) {
      throw new NotFoundException('No hay ningún challenger publicado.');
    }

    return challenger;
  }
}
