import { Controller, Get } from '@nestjs/common';
import { CatsService } from './app.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('allcats')
  getCats(): string {
    return this.catsService.getAllCats();
  }

  @Get('onecat')
  getOneCat(): string {
    return this.catsService.getOneCat();
  }
}