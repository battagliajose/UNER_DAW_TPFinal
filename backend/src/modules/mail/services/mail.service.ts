import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(params: {
    subject: string;
    template: string;
    to: string;
    context: ISendMailOptions['context'];
  }): Promise<void> {
    try {
      if (!params.to) {
        throw new Error('No se encontraron recipientes.');
      }

      const sendEmailParams = {
        to: params.to,
        subject: params.subject,
        template: params.template,
        context: params.context,
      };
      await this.mailerService.sendMail(sendEmailParams);
    } catch (error) {
      // Acá se puede reintentar o escribir en un logger
      throw error;
    }
  }
}
