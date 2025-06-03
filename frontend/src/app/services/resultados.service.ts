import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { RespuestaEncuestaDTO } from '../models/resultados-encuesta.dto';

@Injectable({
  providedIn: 'root',
})
export class ResultadosService {
  private readonly _requestService = inject(RequestService);

  getResultados(
    idEncuesta: number,
    codigo: string,
  ): Observable<RespuestaEncuestaDTO[]> {
    return this._requestService.get<RespuestaEncuestaDTO[]>(
      `/encuestas/${idEncuesta}?codigo=${codigo}&tipo=RESULTADOS`,
    );
  }
}
