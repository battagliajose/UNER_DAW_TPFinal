import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DescargaService {
  constructor(private http: HttpClient) {}

  descargarArchivo(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
//servicio para descargar archivos, como CSV o PDF, desde el backend
// Este servicio utiliza HttpClient para realizar una solicitud GET a la URL proporcionada
// y espera recibir un Blob como respuesta, que representa el archivo descargado.
