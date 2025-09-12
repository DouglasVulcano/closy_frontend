import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Megaphone,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Visão geral e métricas'
  },
  {
    name: 'Campanhas',
    href: '/campaigns',
    icon: Megaphone,
    description: 'Gerencie suas campanhas',
    badge: '12'
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: Users,
    description: 'Contatos capturados',
    badge: '1.2k'
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: User,
    description: 'Configurações da conta'
  },
];

const quickActions = [
  {
    name: 'Nova Campanha',
    href: '/campaigns/new',
    icon: Plus,
    color: 'bg-primary text-primary-foreground'
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: TrendingUp,
    color: 'bg-secondary text-secondary-foreground'
  },
  {
    name: 'Agenda',
    href: '/calendar',
    icon: Calendar,
    color: 'bg-accent text-accent-foreground'
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export const Sidebar = ({ isCollapsed, onToggle, className }: SidebarProps) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface border-r border-border transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-end p-2 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "default" : "secondary"}
                              className="ml-2 h-5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          {!isCollapsed && (
            <>
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ações Rápidas
                </h3>
                
                <div className="space-y-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.name}
                        to={action.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
                          action.color
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="truncate">{action.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <Card className="p-3 bg-gradient-subtle">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-muted-foreground">Status do Sistema</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Todos os serviços operando normalmente
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};