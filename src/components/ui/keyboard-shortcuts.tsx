import { useEffect, useState } from 'react';
import { Command, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'S'], description: 'Salvar projeto', mac: ['⌘', 'S'] },
  { keys: ['Ctrl', 'Z'], description: 'Desfazer', mac: ['⌘', 'Z'] },
  { keys: ['Ctrl', 'Y'], description: 'Refazer', mac: ['⌘', 'Y'] },
  { keys: ['Ctrl', 'P'], description: 'Alternar preview', mac: ['⌘', 'P'] },
  { keys: ['Ctrl', 'N'], description: 'Novo campo', mac: ['⌘', 'N'] },
  { keys: ['Esc'], description: 'Cancelar seleção' },
  { keys: ['Delete'], description: 'Deletar elemento selecionado' },
  { keys: ['?'], description: 'Mostrar atalhos' },
];

export const KeyboardShortcuts = ({ open, onOpenChange }: KeyboardShortcutsProps) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos do Teclado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use estes atalhos para acelerar seu fluxo de trabalho:
          </p>
          
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => {
              const keys = isMac && shortcut.mac ? shortcut.mac : shortcut.keys;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {keys.map((key, keyIndex) => (
                      <Badge 
                        key={keyIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1 font-mono"
                      >
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};