import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { EncuestaDTO, EncuestaResponse } from '../models/encuesta.dto';
import { CreateEncuestaDTO } from '../models/create-encuesta.dto';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  private readonly _requestService = inject(RequestService);

  getAll(): Observable<EncuestaResponse> {
    return this._requestService.get<EncuestaResponse>('/encuestas/obtener-todas');
  }

  getOne(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDTO> {
    return this._requestService.get<EncuestaDTO>(
      `/encuestas/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
    );
  }

  post(encuestaDto: CreateEncuestaDTO): Observable<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return this._requestService.post<{
      id: number;
      codigoRespuesta: string;
      codigoResultados: string;
    }>(`/encuestas`, encuestaDto);
  }

  delete(id: number): Observable<void> {
    return this._requestService.delete<void>(`/encuestas/eliminar/${id}`);
  }
}
