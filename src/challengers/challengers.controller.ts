import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { CreateChallengerDto } from './dto/create-challenger.dto';
import { UpdateChallengerDto } from './dto/update-challenger.dto';

@Controller('challengers')
export class ChallengersController {
  constructor(private readonly challengersService: ChallengersService) {}

  @Post()
  create(@Body() createChallengerDto: CreateChallengerDto) {
    return this.challengersService.create(createChallengerDto);
  }

  @Get()
  findAll() {
    return this.challengersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengerDto: UpdateChallengerDto) {
    return this.challengersService.update(+id, updateChallengerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengersService.remove(+id);
  }
}
