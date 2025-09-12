import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileToggleButtonProps {
  onClick: () => void;
}

export const MobileToggleButton = ({ onClick }: MobileToggleButtonProps) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className="fixed top-4 left-4 z-30 md:hidden bg-background/80 backdrop-blur-sm border-border shadow-lg"
      onClick={onClick}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Abrir menu de edição</span>
    </Button>
  );
};