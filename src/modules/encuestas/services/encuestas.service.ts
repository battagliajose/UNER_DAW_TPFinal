import { Injectable } from '@nestjs/common';

@Injectable()
export class EncuestasService {
  getEncuestaPorId(id: string): string {
    return `Encuesta por ID ${id}`;
  }

  crearEncuesta(): string {
    return 'Encuesta creada';
  }
}
