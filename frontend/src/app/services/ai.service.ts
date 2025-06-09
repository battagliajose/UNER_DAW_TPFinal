import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AutocompletarRequest {
  pregunta: string;
  textoParcial: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly apiUrl = '/api/v1/ai/autocompletar';

  constructor(private http: HttpClient) {}

  autocompletarRespuesta(
    pregunta: string,
    textoParcial: string,
  ): Observable<string> {
    const body: AutocompletarRequest = { pregunta, textoParcial };
    return this.http.post(this.apiUrl, body, { responseType: 'text' });
  }
}
