import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
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
  ) {
    const paymentConfig = await this.createPaymentConfig(card);

    const paymentIntent = await this.stripe.paymentIntents.create({
      ...paymentConfig,
      amount: amount * 100,
      confirm: true,
      currency: 'USD',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    return paymentIntent;
  }
}
