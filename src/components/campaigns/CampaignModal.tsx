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
import { Campaign } from '@/types/api';

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CampaignFormData) => Promise<void>;
    campaign?: Campaign | null; // Se fornecido, é modo edição
    isLoading?: boolean;
}

export interface CampaignFormData {
    title: string;
    slug: string;
    start_date?: string;
    end_date?: string;
}

// Função para validar slug
const validateSlug = (slug: string): string => {
    if (!slug.trim()) {
        return 'Slug é obrigatório';
    }
    if (slug.length < 3) {
        return 'Slug deve ter pelo menos 3 caracteres';
    }
    if (slug.length > 50) {
        return 'Slug deve ter no máximo 50 caracteres';
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return 'Slug deve conter apenas letras minúsculas, números e hífens';
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
        return 'Slug não pode começar ou terminar com hífen';
    }
    return '';
};

// Função para validar datas
const validateDates = (startDate: string, endDate: string): string => {
    // Se ambas as datas estão vazias, é válido
    if (!startDate && !endDate) {
        return '';
    }

    // Se apenas uma data está preenchida
    if (startDate && !endDate) {
        // Validar se a data de início não é anterior a hoje
        const start = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            return 'A data de início não pode ser anterior a hoje';
        }
        return '';
    }

    if (!startDate && endDate) {
        return 'Se a data de fim for informada, a data de início também deve ser informada';
    }

    // Se ambas as datas estão preenchidas
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validar se a data de início não é anterior a hoje
        if (start < today) {
            return 'A data de início não pode ser anterior a hoje';
        }

        // Validar se a data de fim é posterior à data de início
        if (end <= start) {
            return 'A data de fim deve ser posterior à data de início';
        }

        // Validar se o período não excede 2 anos
        const twoYearsFromStart = new Date(start);
        twoYearsFromStart.setFullYear(twoYearsFromStart.getFullYear() + 2);
        
        if (end > twoYearsFromStart) {
            return 'O período da campanha não pode exceder 2 anos';
        }
    }

    return '';
};

export const CampaignModal: React.FC<CampaignModalProps> = ({
    isOpen,
    onClose,
    onSave,
    campaign,
    isLoading = false
}) => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [slugError, setSlugError] = useState('');
    const [dateError, setDateError] = useState('');

    const isEditMode = !!campaign;

    // Resetar formulário quando o modal abrir/fechar ou campanha mudar
    useEffect(() => {
        if (isOpen) {
            if (campaign) {
                // Modo edição
                setTitle(campaign.title);
                setSlug(campaign.slug);
                setStartDate(campaign.start_date || '');
                setEndDate(campaign.end_date || '');
            } else {
                // Modo criação
                setTitle('');
                setSlug('');
                setStartDate('');
                setEndDate('');
            }
            setSlugError('');
            setDateError('');
        }
    }, [isOpen, campaign]);

    const handleSlugChange = (value: string) => {
        // Converter para minúsculas e permitir letras, números e hífens
        const cleanedSlug = value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '')
            .replace(/--+/g, '-'); // Evitar hífens consecutivos
        
        setSlug(cleanedSlug);
        setSlugError(validateSlug(cleanedSlug));
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        setDateError(validateDates(value, endDate));
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        setDateError(validateDates(startDate, value));
    };

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            return;
        }

        // Validar slug
        const slugValidationError = validateSlug(slug);
        if (slugValidationError) {
            setSlugError(slugValidationError);
            return;
        }

        // Validar datas
        const dateValidationError = validateDates(startDate, endDate);
        if (dateValidationError) {
            setDateError(dateValidationError);
            return;
        }

        const formData: CampaignFormData = {
            title: title.trim(),
            slug: slug.trim()
        };

        if (startDate) {
            formData.start_date = startDate;
        }
        
        if (endDate) {
            formData.end_date = endDate;
        }

        await onSave(formData);
    };

    const handleClose = () => {
        setTitle('');
        setSlug('');
        setStartDate('');
        setEndDate('');
        setSlugError('');
        setDateError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEditMode ? 'Editar Campanha' : 'Nova Campanha'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isEditMode 
                            ? 'Edite as informações da campanha.'
                            : 'Preencha as informações para criar uma nova campanha.'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Título *
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título da campanha"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium">
                            Slug *
                        </Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="slug-da-campanha"
                            className={`w-full ${slugError ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                        {slugError && (
                            <p className="text-sm text-red-500">{slugError}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium">
                                Data de Início
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                className={`w-full ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm font-medium">
                                Data de Fim
                            </Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                className={`w-full ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {dateError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{dateError}</p>
                        </div>
                    )}

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-700">
                            <strong>Datas opcionais:</strong> Se informadas, a data de início deve ser hoje ou posterior, 
                            e a data de fim deve ser posterior à data de início. O período máximo é de 2 anos.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!title.trim() || !slug.trim() || !!slugError || !!dateError || isLoading}
                        className="flex-1"
                    >
                        {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar' : 'Criar')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};