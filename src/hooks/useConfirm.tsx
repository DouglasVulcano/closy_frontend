import React, { useState, useCallback } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface ConfirmOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

interface ConfirmState extends ConfirmOptions {
    open: boolean;
    onConfirm: () => void;
}

export const useConfirm = () => {
    const [confirmState, setConfirmState] = useState<ConfirmState>({
        open: false,
        title: '',
        description: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        variant: 'default',
        onConfirm: () => { }
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                ...options,
                open: true,
                onConfirm: () => {
                    resolve(true);
                }
            });
        });
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setConfirmState(prev => ({ ...prev, open: false }));
        }
    }, []);

    const ConfirmComponent = useCallback(() => (
        <ConfirmDialog
            open={confirmState.open}
            onOpenChange={handleOpenChange}
            title={confirmState.title}
            description={confirmState.description}
            confirmText={confirmState.confirmText}
            cancelText={confirmState.cancelText}
            variant={confirmState.variant}
            onConfirm={confirmState.onConfirm}
        />
    ), [confirmState, handleOpenChange]);

    return {
        confirm,
        ConfirmComponent
    };
};