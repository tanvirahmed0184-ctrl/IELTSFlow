// Stripe integration for payments
// TODO: Configure Stripe client with test mode keys

export function getStripeClient() {
  // TODO: Initialize and return Stripe client
  return null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}
