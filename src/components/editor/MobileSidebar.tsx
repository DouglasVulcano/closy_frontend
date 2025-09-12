import { useState, useEffect } from 'react';
import {
    Type,
    Palette,
    FormInput,
    Settings,
    X,
    Save,
    Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/store/editor-hooks';
import { ColorPicker } from './ColorPicker';
import { FormFieldEditor } from './FormFieldEditor';
import { useToast } from '@/hooks/use-toast';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'content' | 'design' | 'form' | 'settings';

const tabs = [
    { id: 'content' as TabType, label: 'Conteúdo', icon: Type },
    { id: 'design' as TabType, label: 'Design', icon: Palette },
    { id: 'form' as TabType, label: 'Formulário', icon: FormInput },
    { id: 'settings' as TabType, label: 'Config', icon: Settings },
];

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
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

    const handleContentUpdate = (field: string, value: string) => {
        updateCampaign({ [field]: value });
    };

    const handleColorChange = (colorType: string, color: string) => {
        updateCampaign({ [colorType]: color });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!startY) return;

        const currentY = e.touches[0].clientY;
        const diffY = currentY - startY;

        // Se o usuário deslizar para baixo mais de 100px, fechar o drawer
        if (diffY > 100) {
            onClose();
            setStartY(null);
        }
    };

    const handleTouchEnd = () => {
        setStartY(null);
    };

    // Fechar com tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevenir scroll do body quando o drawer estiver aberto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'content':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile-title" className="text-sm font-medium">
                                Título da Campanha
                            </Label>
                            <Input
                                id="mobile-title"
                                value={state.campaign.title}
                                onChange={(e) => handleContentUpdate('title', e.target.value)}
                                placeholder="Digite o título"
                                className="text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile-description" className="text-sm font-medium">
                                Descrição
                            </Label>
                            <Textarea
                                id="mobile-description"
                                value={state.campaign.description}
                                onChange={(e) => handleContentUpdate('description', e.target.value)}
                                placeholder="Descreva sua campanha..."
                                rows={3}
                                className="text-sm resize-none"
                            />
                        </div>
                    </div>
                );

            case 'design':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Cor de Fundo</Label>
                                <ColorPicker
                                    color={state.campaign.backgroundColor}
                                    onChange={(color) => handleColorChange('backgroundColor', color)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Cor do Texto</Label>
                                <ColorPicker
                                    color={state.campaign.textColor}
                                    onChange={(color) => handleColorChange('textColor', color)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Cor de Destaque</Label>
                                <ColorPicker
                                    color={state.campaign.accentColor}
                                    onChange={(color) => handleColorChange('accentColor', color)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Imagem de Fundo</Label>
                            <Button variant="outline" className="w-full gap-2 text-sm">
                                <Image className="h-4 w-4" />
                                Adicionar Imagem
                            </Button>
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">Campos do Formulário</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Configure os campos que aparecerão no seu formulário
                            </p>
                        </div>
                        <FormFieldEditor />
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">URL Personalizada</Label>
                            <Input placeholder="minha-campanha" className="text-sm" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Mensagem de Sucesso</Label>
                            <Textarea
                                placeholder="Obrigado! Entraremos em contato em breve."
                                rows={3}
                                className="text-sm resize-none"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="fixed inset-x-0 bottom-0 z-50 bg-surface border-t border-border md:hidden max-h-[80vh] flex flex-col rounded-t-xl shadow-2xl"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Indicator */}
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Editor</h2>
                    <div className="flex items-center gap-2">
                        <Button size="sm" className="gap-2 text-xs" onClick={handleSave}>
                            <Save className="h-3 w-3" />
                            Salvar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border bg-muted/20">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 text-xs font-medium transition-all duration-200 relative ${isActive
                                    ? 'text-primary bg-background/80'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                )}
                                <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'
                                    }`} />
                                <span className="truncate max-w-full">{tab.label}</span>
                                {tab.id === 'form' && (
                                    <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] leading-none">
                                        {state.campaign.formFields.length}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3">
                        <div className="bg-background/50 rounded-lg border border-border/50">
                            <div className="p-4">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};