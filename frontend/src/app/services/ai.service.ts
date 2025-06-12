import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AutocompletarRequest {
  tituloEncuesta: string;
  pregunta: string;
  textoParcial: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private baseUrl = '/api/v1/ai';

  constructor(private http: HttpClient) {}

  autocompletarRespuesta(
    tituloEncuesta: string,
    pregunta: string,
    textoParcial: string,
  ): Observable<string> {
    const body: AutocompletarRequest = {
      tituloEncuesta,
      pregunta,
      textoParcial,
    };
    return this.http.post(this.baseUrl + '/autocompletar', body, {
      responseType: 'text',
    });
  }

  obtenerInformeEncuesta(id: number, codigo: string) {
    return this.http.get(this.baseUrl + `/informeencuesta/${id}/${codigo}`, {
      responseType: 'text',
    });
  }
}
