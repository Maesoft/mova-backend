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

  // 👨‍🏫 SOLO TRAINER
  @Post()
  @Roles('trainer')
  create(@Body() dto: CreateRoutineDto) {
    return this.routinesService.create(dto);
  }

  // 👨‍🏫 SOLO TRAINER
  @Get(':id')
  @Roles('trainer')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(+id);
  }

  // 👨‍🏫 SOLO TRAINER
  @Post(':userId/active-routine/:routineId')
  @Roles('trainer')
  setActive(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.setActiveRoutine(+userId, +routineId);
  }

  // 🧍 USUARIO (su propia rutina) + trainer opcional
  @Get('me/active')
  @Roles('user', 'trainer')
  getActive(@CurrentUser() user: AuthUser) {
    return this.routinesService.getActiveRoutine(user.id);
  }

  // 🧍 USUARIO
  @Get('me/today')
  @Roles('user', 'trainer')
  getToday(@CurrentUser() user: AuthUser) {
    return this.routinesService.getTodayRoutine(user.id);
  }

  // 🧍 USUARIO
  @Post('me/complete-day')
  @Roles('user', 'trainer')
  completeDay(@CurrentUser() user: AuthUser) {
    return this.routinesService.completeDay(user.id);
  }
}
