import { Injectable } from '@nestjs/common';

@Injectable()
export class EncuestasService {
  
  echo(): string {
    return 'La aplicación está funcionando correctamente!!! Vamo los pibe!';
  }

  getEncuestaPorId(id: string): string {
    return `Encuesta por ID ${id}`;
  }

  crearEncuesta(): string {
    return 'Encuesta creada';
  }
}
