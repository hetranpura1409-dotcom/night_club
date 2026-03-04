import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe | null = null;

    constructor() {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (apiKey && apiKey !== '') {
            this.stripe = new Stripe(apiKey, {
                apiVersion: '2026-02-25.clover' as any,
            });
        }
    }

    async createPaymentIntent(amount: number, currency: string = 'eur') {
        return await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }

    async confirmPayment(paymentIntentId: string) {
        return await this.stripe.paymentIntents.confirm(paymentIntentId);
    }

    async refundPayment(paymentIntentId: string, amount?: number) {
        // Demo mode: return mock refund if Stripe not configured
        if (!this.stripe) {
            return {
                id: `re_demo_${Date.now()}`,
                payment_intent: paymentIntentId,
                amount: amount || 0,
                status: 'succeeded',
            };
        }
        return await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
    }

    async retrievePaymentIntent(paymentIntentId: string) {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }

    async createCustomer(email: string, name: string) {
        return await this.stripe.customers.create({
            email,
            name,
        });
    }
}
