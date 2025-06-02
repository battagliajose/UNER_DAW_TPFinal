import { Injectable } from '@angular/core';
import { CreateEncuestaDTO } from '../models/create-encuesta.dto';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly ENCUESTA = 'encuesta';

  setEncuestaData(encuesta: CreateEncuestaDTO): void {
    localStorage.setItem(this.ENCUESTA, JSON.stringify(encuesta));
  }

  getEncuestaData(): CreateEncuestaDTO | null {
    const encuestaGuardada = localStorage.getItem(this.ENCUESTA);
    if (encuestaGuardada) {
      const encuesta: CreateEncuestaDTO = JSON.parse(encuestaGuardada);
      return encuesta;
    }
    return null;
  }

  updateEncuestaData(encuesta: CreateEncuestaDTO): void {
    this.removeEncuestaData();
    this.setEncuestaData(encuesta);
  }

  removeEncuestaData(): void {
    localStorage.removeItem(this.ENCUESTA);
  }
}
