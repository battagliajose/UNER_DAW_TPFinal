import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { ResumenEstadisticoDTO } from '../models/resumen-estadistico.dto';

@Injectable({
  providedIn: 'root',
})
export class ResumenEstadisticoService {
  private readonly _requestService = inject(RequestService);

  obtenerResumen(
    idEncuesta: number,
    codigo: string,
  ): Observable<ResumenEstadisticoDTO> {
    return this._requestService.get<ResumenEstadisticoDTO>(
      `/reportes/${idEncuesta}/${codigo}`,
    );
  }
}
