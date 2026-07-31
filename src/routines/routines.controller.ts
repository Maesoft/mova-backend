import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CurrentUser } from '../auth/roles/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  // 🧍 USUARIO → VER SU RUTINA ACTUAL
  @Get('me')
  @Roles('user', 'trainer')
  getMyRoutine(@CurrentUser() user: AuthUser) {
    return this.routinesService.getUserRoutine(user.id);
  }

  // 🧍 USUARIO → VER SOLO EL DÍA ACTUAL
  @Get('me/today')
  @Roles('user', 'trainer')
  getToday(@CurrentUser() user: AuthUser) {
    return this.routinesService.getTodayRoutine(user.id);
  }

  // 🧍 USUARIO → COMPLETAR DÍA
  @Post('me/complete-day')
  @Roles('user', 'trainer')
  completeDay(@CurrentUser() user: AuthUser) {
    return this.routinesService.completeDay(user.id);
  }

  @Get('me/progress')
  @Roles('user', 'trainer')
  getProgress(@CurrentUser() user: AuthUser) {
    return this.routinesService.getUserProgress(user.id);
  }

  // 👨‍🏫 CREAR RUTINA
  @Post()
  @Roles('trainer')
  create(@Body() dto: CreateRoutineDto) {
    return this.routinesService.create(dto);
  }

  // 👨‍🏫 LISTAR TODAS LAS RUTINAS
  @Get()
  @Roles('trainer')
  findAllRoutines() {
    return this.routinesService.findAllRoutines();
  }
  // 👨‍🏫 LISTAR TODOS LOS CHALLENGERS
  @Get('challengers')
  @Roles('trainer')
  findAllChallengers() {
    return this.routinesService.findAllChallengers();
  }

  // 👨‍🏫 OBTENER UNA RUTINA
  @Get(':id')
  @Roles('trainer')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(+id);
  }

  // 👨‍🏫 ASIGNAR RUTINA A USUARIO
  @Post(':userId/assign/:routineId')
  @Roles('trainer')
  assignRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.assignRoutineToUser(+userId, +routineId);
  }
}
