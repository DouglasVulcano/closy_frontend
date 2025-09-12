import { useState, useEffect, useCallback } from 'react';
import {
  Type,
  Palette,
  Image,
  Save,
  Settings,
  FormInput,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/store/editor-store';
import { ColorPicker } from './ColorPicker';
import { FormFieldEditor } from './FormFieldEditor';
import { useToast } from '@/hooks/use-toast';


export const EditorSidebar = () => {
  const { state, updateCampaign, togglePreview, markClean } = useEditor();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    content: true,
    design: false,
    form: false,
    settings: false,
  });
  const { toast } = useToast();

  const handleSave = useCallback(() => {
    // Simulate save
    markClean();
    toast({
      title: "Projeto salvo!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  }, [markClean, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd combinations
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'p':
            e.preventDefault();
            togglePreview();
            break;
          case 'n':
            e.preventDefault();
            setExpandedSections(prev => ({ ...prev, form: true }));
            break;
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === 'Escape') {
        // Handle escape key
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePreview, handleSave]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleContentUpdate = (field: string, value: string) => {
    updateCampaign({ [field]: value });
  };

  const handleColorChange = (colorType: string, color: string) => {
    updateCampaign({ [colorType]: color });
  };

  return (
    <div className="w-80 bg-surface border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Editor</h2>
          <div className="flex gap-2">
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Content Section */}
          <Card className="border-border">
            <button
              onClick={() => toggleSection('content')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-primary" />
                <span className="font-medium">Conteúdo</span>
              </div>
              {expandedSections.content ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.content && (
              <div className="p-4 pt-0 space-y-4">
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
            )}
          </Card>

          {/* Design Section */}
          <Card className="border-border">
            <button
              onClick={() => toggleSection('design')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-secondary" />
                <span className="font-medium">Design</span>
              </div>
              {expandedSections.design ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.design && (
              <div className="p-4 pt-0 space-y-4">
                <div className="space-y-3">
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
            )}
          </Card>

          {/* Form Section */}
          <Card className="border-border">
            <button
              onClick={() => toggleSection('form')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FormInput className="h-5 w-5 text-accent" />
                <span className="font-medium">Formulário</span>
                <Badge variant="secondary" className="ml-auto mr-2">
                  {state.campaign.formFields.length}
                </Badge>
              </div>
              {expandedSections.form ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.form && (
              <div className="p-4 pt-0">
                <FormFieldEditor />
              </div>
            )}
          </Card>

          {/* Settings Section */}
          <Card className="border-border">
            <button
              onClick={() => toggleSection('settings')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Configurações</span>
              </div>
              {expandedSections.settings ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.settings && (
              <div className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label>URL Personalizada</Label>
                  <Input placeholder="minha-campanha" className="focus-ring" />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de Sucesso</Label>
                  <Textarea
                    placeholder="Obrigado! Entraremos em contato em breve."
                    rows={3}
                    className="focus-ring resize-none"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};