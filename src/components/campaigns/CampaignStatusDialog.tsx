import React from 'react';
import { Check, Play, Pause, FileText, CheckCircle, Settings } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

interface StatusOption {
    value: CampaignStatus;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    description: string;
}

const statusOptions: StatusOption[] = [
    {
        value: 'active',
        label: 'Ativa',
        icon: Play,
        color: 'text-green-600',
        variant: 'default',
        description: 'Campanha está coletando leads ativamente'
    },
    {
        value: 'paused',
        label: 'Pausada',
        icon: Pause,
        color: 'text-yellow-600',
        variant: 'secondary',
        description: 'Campanha temporariamente pausada'
    },
    {
        value: 'draft',
        label: 'Rascunho',
        icon: FileText,
        color: 'text-gray-600',
        variant: 'outline',
        description: 'Campanha em desenvolvimento'
    },
    {
        value: 'completed',
        label: 'Concluída',
        icon: CheckCircle,
        color: 'text-blue-600',
        variant: 'secondary',
        description: 'Campanha finalizada'
    }
];

interface CampaignStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: CampaignStatus;
    campaignTitle: string;
    onStatusChange: (newStatus: CampaignStatus) => void;
}

export const CampaignStatusDialog: React.FC<CampaignStatusDialogProps> = ({
    isOpen,
    onClose,
    currentStatus,
    campaignTitle,
    onStatusChange
}) => {
    const [selectedStatus, setSelectedStatus] = React.useState<CampaignStatus>(currentStatus);

    React.useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus, isOpen]);

    const handleConfirm = () => {
        if (selectedStatus !== currentStatus) {
            onStatusChange(selectedStatus);
        }
        onClose();
    };

    const currentOption = statusOptions.find(option => option.value === currentStatus);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Alterar Status da Campanha
                    </DialogTitle>
                    <DialogDescription>
                        Altere o status da campanha "{campaignTitle}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Status atual:</span>
                        {currentOption && (
                            <Badge variant={currentOption.variant}>
                                <currentOption.icon className="h-3 w-3 mr-1" />
                                {currentOption.label}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Novo status:</label>
                        <div className="grid gap-2">
                            {statusOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = option.value === selectedStatus;
                                const isCurrent = option.value === currentStatus;
                                
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedStatus(option.value)}
                                        className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                                            isSelected 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:bg-muted/50'
                                        } ${isCurrent ? 'opacity-50' : ''}`}
                                        disabled={isCurrent}
                                    >
                                        <Icon className={`h-4 w-4 mt-0.5 ${option.color}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{option.label}</span>
                                                {isSelected && (
                                                    <Check className="h-3 w-3 text-primary" />
                                                )}
                                                {isCurrent && (
                                                    <span className="text-xs text-muted-foreground">(atual)</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                        disabled={selectedStatus === currentStatus}
                    >
                        Alterar Status
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};