import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  constructor(private http: HttpClient) {}

  postRespuestas(dto: any): Observable<any> {
    return this.http.post('/api/v1/respuestas/responder', dto);
  }
}
