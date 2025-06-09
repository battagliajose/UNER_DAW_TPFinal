import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EmailEnlacesDto } from '../dtos/email-enlaces.dto';
import { MailService } from '../services/mail.service';
import * as QRCode from 'qrcode';

@Controller('/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/sendEnlaces')
  async emailEnlaces(
    @Body() dto: EmailEnlacesDto,
  ): Promise<{ message: string }> {
    try {
      const qrBase64 = await QRCode.toDataURL(dto.participationLink, {
        type: 'image/png',
        width: 300,
      });
      await this.mailService.sendEmail({
        to: dto.email,
        subject: 'OpinAR - Enlaces de tu encuesta',
        template: 'enlaces',
        context: {
          consultationLink: dto.consultationLink,
          participationLink: dto.participationLink,
          qrCodeImage: qrBase64,
        },
      });
      return { message: 'Email enviado' };
    } catch (error) {
      throw new HttpException(
        'Error al intentar enviar el email',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
