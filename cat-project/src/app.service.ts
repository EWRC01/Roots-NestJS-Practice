import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  
  getAllCats(): string {
    return 'Get all cats!';
  }

  getOneCat(): string {
    return 'Get one cat!';
  }
}
