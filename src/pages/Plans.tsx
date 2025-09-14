import React, { useState, useEffect } from 'react';
import { apiService, Plan } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Check, Loader2, Crown, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPlan, setProcessingPlan] = useState<number | null>(null);
  
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!token) return;
      
      try {
        const plansData = await apiService.getPlans(token);
        setPlans(plansData.filter(plan => plan.active));
      } catch (err) {
        setError('Erro ao carregar planos');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [token]);

  const handleSelectPlan = async (planId: number) => {
    if (!token) return;
    
    setProcessingPlan(planId);
    setError('');

    try {
      const successUrl = `${window.location.origin}/dashboard`;
      const cancelUrl = `${window.location.origin}/plans?error=cancelled`;
      
      const checkoutData = await apiService.createCheckout(
        token,
        planId,
        successUrl,
        cancelUrl
      );
      
      // Redirecionar para o checkout do Stripe
      window.location.href = checkoutData.checkout_url;
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
      console.error('Error creating checkout:', err);
    } finally {
      setProcessingPlan(null);
    }
  };

  const parseFeatures = (featuresString: string): string[] => {
    try {
      return JSON.parse(featuresString);
    } catch {
      return [];
    }
  };

  const formatPrice = (price: string) => {
    return `R$ ${price.replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <img
            className="mx-auto h-20 w-auto mb-8"
            src="/closy.png"
            alt="Closy"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Escolha seu plano
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Olá {user?.name}! Selecione o plano ideal para suas necessidades.
          </p>
        </div>

        {error && (
          <div className="mt-8 max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => {
            const features = parseFeatures(plan.features);
            const isPopular = plan.name === 'Pro';
            const isProcessing = processingPlan === plan.id;
            
            return (
              <Card key={plan.id} className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {plan.name === 'Pro' ? (
                      <Crown className="h-8 w-8 text-yellow-500" />
                    ) : (
                      <Star className="h-8 w-8 text-blue-500" />
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-base font-medium text-gray-500">/mês</span>
                  </div>
                  
                  {plan.trial_days > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.trial_days} dias grátis
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>Até {plan.monthly_leads_limit.toLocaleString()} leads por mês</span>
                    </li>
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing}
                    className={`w-full ${
                      isPopular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      `Escolher ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Todos os planos incluem período de teste gratuito. 
            Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;