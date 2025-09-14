const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Plan {
  id: number;
  name: string;
  price: string;
  role: string;
  active: boolean;
  trial_days: number;
  monthly_leads_limit: number;
  description: string;
  features: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export const apiService = {
  async getPlans(token: string): Promise<Plan[]> {
    const response = await fetch(`${API_BASE_URL}/plans`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    return response.json();
  },

  async createCheckout(
    token: string,
    planId: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        return_success_url: successUrl,
        return_cancel_url: cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout');
    }

    return response.json();
  },
};