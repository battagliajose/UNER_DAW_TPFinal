import { HttpParams, HttpHeaders } from '@angular/common/http';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class RequestOptions {
  method: RequestMethod;
  url: string;
  body?: any;
  params?: HttpParams;
  headers?: HttpHeaders;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';

  constructor(requestOptions: RequestOptions) {
    this.method = requestOptions.method;
    this.url = requestOptions.url;
    this.body = requestOptions.body;
    this.params = requestOptions.params;
    this.headers = requestOptions.headers;
    this.responseType = requestOptions.responseType ?? 'json';
  }
}
