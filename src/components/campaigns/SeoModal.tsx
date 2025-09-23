import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeoConfig } from '@/types/api';
import { Search, Globe } from 'lucide-react';
import { FeatureBlock } from '@/components/FeatureBlock';
import { useAuth } from '@/hooks/useAuth';

interface SeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seoConfig: SeoConfig) => void;
  initialData?: SeoConfig | null;
  campaignTitle: string;
}

export const SeoModal: React.FC<SeoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  campaignTitle,
}) => {
  const { user } = useAuth();
  const [seoConfig, setSeoConfig] = useState<SeoConfig>({
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    robots: 'index, follow',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSeoConfig(initialData);
    } else {
      // Pré-preencher com dados da campanha
      setSeoConfig(prev => ({
        ...prev,
        title: campaignTitle,
        og_title: campaignTitle,
        twitter_title: campaignTitle,
      }));
    }
  }, [initialData, campaignTitle]);

  const handleInputChange = (field: keyof SeoConfig, value: string) => {
    setSeoConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(seoConfig);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configurações de SEO:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Configurações de SEO
          </DialogTitle>
          <DialogDescription>
            Configure as informações de SEO para a página da campanha "{campaignTitle}"
          </DialogDescription>
        </DialogHeader>

        <FeatureBlock
          requiredPlan="PRO"
          userPlan={user?.role}
          featureName="Configurações de SEO"
          description="Otimize suas campanhas para mecanismos de busca e redes sociais"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Open Graph
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas de SEO</CardTitle>
                  <CardDescription>
                    Configure o título, descrição e palavras-chave da página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Página</Label>
                    <Input
                      id="title"
                      value={seoConfig.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Título otimizado para SEO (máx. 60 caracteres)"
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {seoConfig.title?.length || 0}/60 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Descrição</Label>
                    <Textarea
                      id="description"
                      value={seoConfig.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descrição da página para os resultados de busca (máx. 160 caracteres)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {seoConfig.description?.length || 0}/160 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input
                      id="keywords"
                      value={seoConfig.keywords || ''}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      placeholder="palavra1, palavra2, palavra3"
                    />
                    <p className="text-sm text-muted-foreground">
                      Separe as palavras-chave com vírgulas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph (Facebook, LinkedIn)</CardTitle>
                  <CardDescription>
                    Configure como sua página aparece quando compartilhada em redes sociais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="og_title">Título Open Graph</Label>
                    <Input
                      id="og_title"
                      value={seoConfig.og_title || ''}
                      onChange={(e) => handleInputChange('og_title', e.target.value)}
                      placeholder="Título para compartilhamento social"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_description">Descrição Open Graph</Label>
                    <Textarea
                      id="og_description"
                      value={seoConfig.og_description || ''}
                      onChange={(e) => handleInputChange('og_description', e.target.value)}
                      placeholder="Descrição para compartilhamento social"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_image">Imagem Open Graph</Label>
                    <Input
                      id="og_image"
                      value={seoConfig.og_image || ''}
                      onChange={(e) => handleInputChange('og_image', e.target.value)}
                      placeholder="URL da imagem (recomendado: 1200x630px)"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recomendado: 1200x630 pixels, formato JPG ou PNG
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </FeatureBlock>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};