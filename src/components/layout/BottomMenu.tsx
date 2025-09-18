import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Megaphone,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Campanhas', href: '/campaigns', icon: Megaphone },
  { name: 'Leads', href: '/leads', icon: Users },
];

export const BottomMenu = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      {/* Floating container */}
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl px-2 py-3">
        <div className="flex items-center justify-around">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[56px] relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
                
                <div className={cn(
                  'p-2 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'bg-primary/10 scale-110' 
                    : 'hover:bg-muted/50'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <span className={cn(
                  'text-[10px] font-medium mt-1 transition-all duration-300',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};