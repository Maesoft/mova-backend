import { Injectable } from '@nestjs/common';
import { CreateChallengerDto } from './dto/create-challenger.dto';
import { UpdateChallengerDto } from './dto/update-challenger.dto';

@Injectable()
export class ChallengersService {
  create(createChallengerDto: CreateChallengerDto) {
    return 'This action adds a new challenger';
  }

  findAll() {
    return `This action returns all challengers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} challenger`;
  }

  update(id: number, updateChallengerDto: UpdateChallengerDto) {
    return `This action updates a #${id} challenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenger`;
  }
}
