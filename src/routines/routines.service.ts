import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

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

  async create(dto: CreateRoutineDto) {
    const trainer = await this.userRepository.findOne({
      where: { id: dto.trainerId },
    });

    if (!trainer) throw new NotFoundException('Trainer not found');

    const assignedUsers = await this.userRepository.find({
      where: { id: In(dto.assignedToIds) },
    });

    const routine = this.routineRepository.create({
      name: dto.name,
      description: dto.description,
      trainer,
      assignedTo: assignedUsers,

      blocks: dto.blocks.map((block) => ({
        day: block.day,
        order: block.order,

        exercises: block.exercises.map((ex) => ({
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          order: ex.order,
          exercise: { id: ex.exerciseId },
        })),
      })),
    });

    return this.routineRepository.save(routine);
  }
  async findOne(id: number) {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: [
        'trainer',
        'assignedTo',
        'blocks',
        'blocks.exercises',
        'blocks.exercises.exercise',
      ],
    });

    if (!routine) throw new NotFoundException('Routine not found');

    return this.groupByDay(routine);
  }
  async assignUsers(routineId: number, userIds: number[]) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
      relations: ['assignedTo'],
    });

    if (!routine) throw new NotFoundException('Routine not found');

    const users = await this.userRepository.findBy({
      id: In(userIds),
    });

    const existingIds = routine.assignedTo.map((u) => u.id);

    const newUsers = users.filter((u) => !existingIds.includes(u.id));

    routine.assignedTo = [...routine.assignedTo, ...newUsers];

    return this.routineRepository.save(routine);
  }
  async setActiveRoutine(userId: number, routineId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const routine = await this.routineRepository.findOneBy({ id: routineId });
    if (!routine) throw new NotFoundException('Routine not found');

    // 🔥 desactivar todas las rutinas del usuario
    await this.userRoutineRepository.update(
      { user: { id: userId } },
      { isActive: false },
    );

    let userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user: { id: userId },
        routine: { id: routineId },
      },
    });

    if (!userRoutine) {
      userRoutine = this.userRoutineRepository.create({
        user,
        routine,
        isActive: true,
      });
    } else {
      userRoutine.isActive = true;
    }

    return this.userRoutineRepository.save(userRoutine);
  }
  async getActiveRoutine(userId: number) {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: [
        'routine',
        'routine.blocks',
        'routine.blocks.exercises',
        'routine.blocks.exercises.exercise',
      ],
    });

    if (!userRoutine) {
      throw new NotFoundException('No active routine');
    }

    return this.groupByDay(userRoutine.routine);
  }
  async getTodayRoutine(userId: number) {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: [
        'routine',
        'routine.blocks',
        'routine.blocks.exercises',
        'routine.blocks.exercises.exercise',
      ],
    });

    if (!userRoutine) {
      throw new NotFoundException('No active routine');
    }

    const routine = userRoutine.routine;
    const currentDay = userRoutine.currentDay;

    const blocksToday = routine.blocks
      .filter((b) => b.day === currentDay)
      .sort((a, b) => a.order - b.order)
      .map((block) => ({
        id: block.id,
        order: block.order,
        exercises: [...block.exercises].sort((a, b) => a.order - b.order),
      }));

    return {
      routineId: routine.id,
      routineName: routine.name,
      today: currentDay,
      blocks: blocksToday,
    };
  }
  async completeDay(userId: number) {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: ['routine', 'routine.blocks'],
    });

    if (!userRoutine) {
      throw new NotFoundException('No active routine');
    }

    // 🔥 VALIDACIÓN (ANTES de avanzar)
    if (userRoutine.lastCompletedAt) {
      const last = new Date(userRoutine.lastCompletedAt);
      const today = new Date();

      last.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (last.getTime() === today.getTime()) {
        throw new BadRequestException('La rutina de hoy ya esta completa.');
      }
    }

    const routine = userRoutine.routine;

    const uniqueDays = [...new Set(routine.blocks.map((b) => b.day))].sort(
      (a, b) => a - b,
    );

    const totalDays = uniqueDays.length;

    const currentIndex = uniqueDays.indexOf(userRoutine.currentDay);
    const nextIndex = (currentIndex + 1) % totalDays;
    const nextDay = uniqueDays[nextIndex];

    userRoutine.currentDay = nextDay;
    userRoutine.lastCompletedAt = new Date();

    return this.userRoutineRepository.save(userRoutine);
  }
  private groupByDay(routine: Routine) {
    type DayGroup = {
      day: number;
      blocks: {
        id: number;
        order: number;
        exercises: any[];
      }[];
    };

    const daysMap = new Map<number, DayGroup>();

    for (const block of routine.blocks) {
      if (!daysMap.has(block.day)) {
        daysMap.set(block.day, {
          day: block.day,
          blocks: [],
        });
      }

      const sortedExercises = [...block.exercises].sort(
        (a, b) => a.order - b.order,
      );

      daysMap.get(block.day)!.blocks.push({
        id: block.id,
        order: block.order,
        exercises: sortedExercises,
      });
    }

    const days = Array.from(daysMap.values()).map((day) => ({
      ...day,
      blocks: day.blocks.sort((a, b) => a.order - b.order),
    }));

    days.sort((a, b) => a.day - b.day);

    return {
      id: routine.id,
      name: routine.name,
      description: routine.description,
      trainer: routine.trainer,
      assignedTo: routine.assignedTo,
      days,
    };
  }
}
