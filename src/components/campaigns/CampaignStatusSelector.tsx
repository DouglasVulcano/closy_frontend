import React from 'react';
import { Check, Play, Pause, FileText, CheckCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        description: 'Campanha está coletando leads'
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

interface CampaignStatusSelectorProps {
    currentStatus: CampaignStatus;
    onStatusChange: (newStatus: CampaignStatus) => void;
    disabled?: boolean;
}

export const CampaignStatusSelector: React.FC<CampaignStatusSelectorProps> = ({
    currentStatus,
    onStatusChange,
    disabled = false
}) => {
    const currentOption = statusOptions.find(option => option.value === currentStatus);
    const CurrentIcon = currentOption?.icon || Play;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 hover:bg-transparent"
                    disabled={disabled}
                >
                    <Badge
                        variant={currentOption?.variant || 'default'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <CurrentIcon className="h-3 w-3 mr-1" />
                        {currentOption?.label}
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = option.value === currentStatus;
                    
                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => onStatusChange(option.value)}
                            className="flex items-start gap-3 p-3 cursor-pointer"
                            disabled={isSelected}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <Icon className={`h-4 w-4 ${option.color}`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{option.label}</span>
                                        {isSelected && (
                                            <Check className="h-3 w-3 text-green-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};