import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Lock } from 'lucide-react';
import { plansService } from '@/services/plans.service';
import { useToast } from '@/hooks/use-toast';

interface FeatureBlockProps {
  children: React.ReactNode;
  requiredPlan: 'PRO' | 'PREMIUM';
  userPlan?: string | null;
  featureName: string;
  description?: string;
  className?: string;
}

export const FeatureBlock: React.FC<FeatureBlockProps> = ({
  children,
  requiredPlan,
  userPlan,
  featureName,
  description,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const hasAccess = userPlan === requiredPlan ||
    (requiredPlan === 'PRO' && userPlan === 'PREMIUM');

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await plansService.getPortalUrl(window.location.href);
      window.open(portalUrl.portal_url, '_blank');
    } catch (error) {
      console.error('Erro ao acessar portal de cobrança:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível acessar o portal de cobrança. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Conteúdo bloqueado com overlay */}
      <div className="relative">
        <div className="pointer-events-none opacity-30 blur-sm">
          {children}
        </div>

        {/* Overlay de bloqueio */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="max-w-md mx-4 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Crown className="h-12 w-12 text-amber-500" />
                  <Sparkles className="h-6 w-6 text-amber-400 absolute -top-1 -right-1" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Feature {requiredPlan}
                </h3>
                <p className="text-sm font-medium text-amber-700">
                  {featureName}
                </p>
                {description && (
                  <p className="text-sm text-gray-600">
                    {description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Esta funcionalidade está disponível apenas para usuários do plano{' '}
                  <span className="font-semibold text-amber-700">{requiredPlan}</span>.
                </p>

                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
                >
                  {isLoading ? (
                    'Carregando...'
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Fazer Upgrade para {requiredPlan}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500">
                  Você será redirecionado para o portal de cobrança
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};