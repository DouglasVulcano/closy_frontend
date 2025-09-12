import { useState, useEffect } from 'react';
import { Settings, Palette, Type, X, ChevronUp, Image, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useEditor } from '@/store/editor-hooks';
import { FormFieldEditor } from './FormFieldEditor';
import { ColorPicker } from './ColorPicker';
import { useToast } from '@/hooks/use-toast';

interface FloatingMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

type TabType = 'content' | 'form' | 'design' | 'settings';

const TABS = {
  content: {
    id: 'content' as TabType,
    label: 'Conteúdo',
    icon: Type,
    color: 'bg-orange-500',
  },
  form: {
    id: 'form' as TabType,
    label: 'Formulário',
    icon: Type,
    color: 'bg-blue-500',
  },
  design: {
    id: 'design' as TabType,
    label: 'Design',
    icon: Palette,
    color: 'bg-purple-500',
  },
  settings: {
    id: 'settings' as TabType,
    label: 'Configurações',
    icon: Settings,
    color: 'bg-green-500',
  },
};

export const FloatingMenu = ({ isOpen, onToggle }: FloatingMenuProps) => {
  const { state, updateCampaign, markClean } = useEditor();
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [startY, setStartY] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    markClean();
    toast({
      title: "Projeto salvo!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleColorChange = (colorType: string, color: string) => {
    updateCampaign({ [colorType]: color });
  };

  const handleContentUpdate = (field: string, value: string) => {
    updateCampaign({ [field]: value });
  };

  // Bloquear scroll do body quando menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar com tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  // Handlers para gestos de swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Se arrastar para baixo mais de 100px, fechar o menu
    if (diff > 100) {
      onToggle();
      setStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Conteúdo da Campanha</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure o título e descrição da sua campanha.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Campanha</Label>
                <Input
                  id="title"
                  value={state.campaign.title}
                  onChange={(e) => handleContentUpdate('title', e.target.value)}
                  placeholder="Digite o título"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={state.campaign.description}
                  onChange={(e) => handleContentUpdate('description', e.target.value)}
                  placeholder="Descreva sua campanha..."
                  rows={4}
                  className="focus-ring resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Campos do Formulário</h3>
              <Badge variant="secondary" className="text-xs">
                {state.campaign.formFields.length} campos
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configure os campos que serão exibidos no seu formulário de captura.
            </p>
            <FormFieldEditor />
          </div>
        );
      case 'design':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Personalização Visual</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Customize as cores e aparência do seu formulário.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <ColorPicker
                  color={state.campaign.backgroundColor}
                  onChange={(color) => handleColorChange('backgroundColor', color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor do Texto</Label>
                <ColorPicker
                  color={state.campaign.textColor}
                  onChange={(color) => handleColorChange('textColor', color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor de Destaque</Label>
                <ColorPicker
                  color={state.campaign.accentColor}
                  onChange={(color) => handleColorChange('accentColor', color)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <Button variant="outline" className="w-full gap-2">
                  <Image className="h-4 w-4" />
                  Adicionar Imagem
                </Button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Configurações Avançadas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajuste configurações avançadas do formulário.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL Personalizada</Label>
                <Input
                  placeholder="minha-campanha"
                  className="focus-ring"
                  value={state.campaign.customUrl || ''}
                  onChange={(e) => handleContentUpdate('customUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Sucesso</Label>
                <Textarea
                  placeholder="Obrigado! Entraremos em contato em breve."
                  rows={3}
                  className="focus-ring resize-none"
                  value={state.campaign.successMessage || ''}
                  onChange={(e) => handleContentUpdate('successMessage', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 border-2 border-background"
        onClick={onToggle}
      >
        <Settings className="h-6 w-6" />
        <span className="sr-only">Abrir menu de edição</span>
      </Button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onToggle}
      />

      {/* Menu Flutuante */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Indicador de Drag */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header com Tabs */}
        <div className="border-b border-border px-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Editor</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="gap-2 text-xs"
              >
                <Save className="h-3 w-3" />
                Salvar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
            {Object.values(TABS).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative
                      ${
                        isActive
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }
                    `}
                  >
                    {/* Indicador de aba ativa */}
                    {isActive && (
                      <div className={`absolute top-1 w-2 h-2 rounded-full ${tab.color}`} />
                    )}
                    
                    {/* Ícone com efeito de escala */}
                    <Icon className={`h-5 w-5 transition-transform ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} />
                    
                    {/* Badge para formulário */}
                    {tab.id === 'form' && (
                      <Badge variant="secondary" className="text-xs absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                        {state.campaign.formFields.length}
                      </Badge>
                    )}
                  </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-background/50 rounded-lg border border-border/50 p-4">
            {renderTabContent()}
          </div>
        </div>

      </div>
    </>
  );
};