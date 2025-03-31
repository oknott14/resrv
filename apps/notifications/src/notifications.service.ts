import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: this.configService.getOrThrow('SMTP_USER'),
        clientId: this.configService.getOrThrow('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.getOrThrow(
          'GOOGLE_OAUTH_CLIENT_SECRET',
        ),
        refreshToken: this.configService.getOrThrow('GOOGLE_OAUTH_REFRESH'),
      },
    });
  }

  private readonly transporter: nodemailer.Transporter;

  async notifyEmail({ email }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow('SMTP_USER'),
      to: email,
      subject: 'RESRV Notification',
      text: 'test email',
    });
  }
}
