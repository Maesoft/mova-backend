import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { AssignUsersDto } from './dto/assign-user-routine.dto';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  create(@Body() dto: CreateRoutineDto) {
    return this.routinesService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(+id);
  }

  @Patch(':id/assign-users')
  assignUsers(@Param('id') id: string, @Body() dto: AssignUsersDto) {
    return this.routinesService.assignUsers(+id, dto.assignedToIds);
  }

  @Post(':userId/active-routine/:routineId')
  setActive(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.setActiveRoutine(+userId, +routineId);
  }

  @Get(':userId/active-routine')
  getActive(@Param('userId') userId: string) {
    return this.routinesService.getActiveRoutine(+userId);
  }

  @Get(':userId/today')
  getToday(@Param('userId') userId: string) {
    return this.routinesService.getTodayRoutine(+userId);
  }

  @Post(':userId/complete-day')
  completeDay(@Param('userId') userId: string) {
    return this.routinesService.completeDay(+userId);
  }
}
