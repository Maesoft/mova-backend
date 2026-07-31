import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Routine } from './entities/routine.entity';
import { User } from '../users/user.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UserRoutine } from './entities/user-routine.entity';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRoutine)
    private readonly userRoutineRepository: Repository<UserRoutine>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateRoutineDto) {
    const trainer = await this.userRepository.findOne({
      where: { id: dto.trainerId },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const routine = this.routineRepository.create({
      name: dto.name,
      trainer,
      isChallenger: dto.isChallenger ?? false,
      days: (dto.days || []).map((day) => ({
        dayNumber: day.dayNumber,
        blocks: (day.blocks || []).map((block) => ({
          name: block.name,
          order: block.order,
          exercises: (block.exercises || []).map((ex) => ({
            instructions: ex.instructions,
            order: ex.order,
            exercise: { id: ex.exerciseId },
          })),
        })),
      })),
    });

    return this.routineRepository.save(routine);
  }

  // ✅ FIND ALL
  async findAll() {
    return this.routineRepository.find({
      relations: [
        'trainer',
        'days',
        'days.blocks',
        'days.blocks.exercises',
        'days.blocks.exercises.exercise',
      ],
      order: {
        days: {
          dayNumber: 'ASC',
          blocks: {
            order: 'ASC',
            exercises: {
              order: 'ASC',
            },
          },
        },
      },
    });
  }

  // ✅ FIND ONE
  async findOne(id: number) {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: [
        'trainer',
        'days',
        'days.blocks',
        'days.blocks.exercises',
        'days.blocks.exercises.exercise',
      ],
    });

    if (!routine) throw new NotFoundException('Routine not found');

    return routine;
  }

  async findAllRoutines() {
    return this.routineRepository.find({
      where: {
        isChallenger: false,
      },
      relations: [
        'trainer',
        'days',
        'days.blocks',
        'days.blocks.exercises',
        'days.blocks.exercises.exercise',
      ],
      order: {
        days: {
          dayNumber: 'ASC',
          blocks: {
            order: 'ASC',
            exercises: {
              order: 'ASC',
            },
          },
        },
      },
    });
  }

  async findAllChallengers() {
    return this.routineRepository.find({
      where: {
        isChallenger: true,
      },
      relations: [
        'trainer',
        'days',
        'days.blocks',
        'days.blocks.exercises',
        'days.blocks.exercises.exercise',
      ],
      order: {
        days: {
          dayNumber: 'ASC',
          blocks: {
            order: 'ASC',
            exercises: {
              order: 'ASC',
            },
          },
        },
      },
    });
  }

  // ✅ ASIGNAR RUTINA
  async assignRoutineToUser(userId: number, routineId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const routine = await this.routineRepository.findOneBy({ id: routineId });
    if (!routine) throw new NotFoundException('Routine not found');

    const existing = await this.userRoutineRepository.findOne({
      where: {
        user: { id: userId },
        routine: { id: routineId },
      },
    });

    if (existing) {
      throw new BadRequestException('La rutina ya está asignada');
    }

    const userRoutine = this.userRoutineRepository.create({
      user,
      routine,
      currentDay: 1,
      completed: false,
    });

    return this.userRoutineRepository.save(userRoutine);
  }

  // ✅ OBTENER RUTINA ACTUAL DEL USUARIO
  async getUserRoutine(userId: number) {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: { user: { id: userId }, completed: false },
      relations: [
        'routine',
        'routine.days',
        'routine.days.blocks',
        'routine.days.blocks.exercises',
        'routine.days.blocks.exercises.exercise',
      ],
    });

    if (!userRoutine) {
      throw new NotFoundException('User has no active routine');
    }

    return userRoutine;
  }

  // ✅ OBTENER SOLO EL DÍA ACTUAL
  async getTodayRoutine(userId: number) {
    const userRoutine = await this.getUserRoutine(userId);

    const currentDay = userRoutine.currentDay;

    const day = userRoutine.routine.days.find(
      (d) => d.dayNumber === currentDay,
    );

    if (!day) {
      throw new NotFoundException('Day not found in routine');
    }

    return {
      routineId: userRoutine.routine.id,
      routineName: userRoutine.routine.name,
      day: currentDay,
      blocks: day.blocks,
    };
  }

  // ✅ COMPLETAR DÍA (avanza automáticamente)
  async completeDay(userId: number) {
    const userRoutine = await this.getUserRoutine(userId);

    const days = userRoutine.routine.days
      .map((d) => d.dayNumber)
      .sort((a, b) => a - b);

    const currentIndex = days.indexOf(userRoutine.currentDay);

    if (currentIndex === -1) {
      throw new BadRequestException('Current day invalid');
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= days.length) {
      userRoutine.completed = true;
    } else {
      userRoutine.currentDay = days[nextIndex];
    }

    return this.userRoutineRepository.save(userRoutine);
  }

  async getUserProgress(userId: number) {
    const ur = await this.userRoutineRepository.findOne({
      where: { user: { id: userId }, completed: false },
      relations: ['routine', 'routine.days'],
    });

    if (!ur) {
      return 0;
    }

    const daysPerWeek = ur.routine.days.length;
    const totalDays = daysPerWeek * 4;

    if (totalDays === 0) return 0;

    return Math.round((ur.currentDay / totalDays) * 100);
  }
}
