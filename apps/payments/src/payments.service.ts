import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      { apiVersion: '2025-02-24.acacia' },
    );
  }

  async createPaymentConfig(card: Stripe.PaymentMethodCreateParams.Card) {
    if (this.configService.get('ENVIRONMENT') == 'development') {
      return {
        payment_method: 'pm_card_visa',
      };
    } else {
      return {
        patmeht_method: await this.stripe.paymentMethods.create({
          type: 'card',
          card,
        }),
        payment_method_types: ['card'],
      };
    }
  }

  async createCharge(
    card: Stripe.PaymentMethodCreateParams.Card,
    amount: number,
    email: string,
  ) {
    const paymentConfig = await this.createPaymentConfig(card);

    const paymentIntent = await this.stripe.paymentIntents.create({
      ...paymentConfig,
      amount: amount * 100,
      confirm: true,
      currency: 'USD',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    this.notificationService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });
    return paymentIntent;
  }
}
