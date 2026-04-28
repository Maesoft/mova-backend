import { Controller, Get, Patch, Param, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CurrentUser } from '../auth/roles/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================
  // 👨‍🏫 TRAINER ENDPOINTS
  // =========================

  // 🔍 Ver todos los usuarios
  @Get()
  @Roles('trainer')
  findAll() {
    return this.usersService.findAll();
  }

  // 🔍 Ver un usuario
  @Get(':id')
  @Roles('trainer')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  // 🔒 Bloquear / desbloquear usuario
  @Patch(':id/toggle-active')
  @Roles('trainer')
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(+id);
  }

  // =========================
  // 🧍 USER ENDPOINTS
  // =========================

  // 👤 Ver mi perfil
  @Get('me/profile')
  @Roles('user', 'trainer')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }
}
