import { inject, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private readonly _requestService = inject(RequestService);

  sendEnlacesEmail(params: {
    email: string;
    participationLink: string;
    consultationLink: string;
  }): Observable<{ message: string }> {
    return this._requestService.post(`/mail/sendEnlaces`, params);
  }
}
