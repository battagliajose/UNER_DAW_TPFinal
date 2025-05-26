import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestOptions } from '../models/request-options';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Clase genérica para hacer las request Http
 */
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly httpClient = inject(HttpClient);
  private readonly BASE_URL = environment.baseUrl + '/api/v1';

  private request<T>(options: RequestOptions): Observable<T> {
    options.headers = options.headers || new HttpHeaders();
    options.params = options.params || new HttpParams();

    return this.httpClient
      .request(options.method, this.BASE_URL + options.url, options)
      .pipe(catchError((error) => this.handleErrors(error)));
  }

  private handleErrors(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case HttpStatusCode.InternalServerError:
      case HttpStatusCode.BadRequest:
        break;
      default:
        console.error('ERROR', error);
        break;
    }
    return throwError(() => error);
  }

  get<T>(
    url: string,
    body?: T,
    params?: HttpParams,
    headers?: HttpHeaders,
    responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json',
  ): Observable<T> {
    const options = new RequestOptions({
      method: 'GET',
      url,
      body,
      params,
      headers,
      responseType,
    });
    return this.request<T>(options);
  }

  post<T>(
    url: string,
    body: any,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const options = new RequestOptions({
      method: 'POST',
      url,
      body,
      params,
      headers,
    });
    return this.request<T>(options);
  }
}
