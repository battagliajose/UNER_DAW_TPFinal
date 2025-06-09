import { Module } from '@nestjs/common';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [MailController],
  providers: [MailService, ConfigService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('emailConfig.host'),
          port: configService.get<number>('emailConfig.port'),
          secure: configService.get<boolean>('emailConfig.secureSsl'),
          auth: {
            user: configService.get<string>('emailConfig.user'),
            pass: configService.get<string>('emailConfig.password'),
          },
        },
        defaults: {
          from: process.env.SMTP_USER,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            stric: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
