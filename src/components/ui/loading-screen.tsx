import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(onLoadingComplete, 800);
    }, 2000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content */}
      <div className="text-center space-y-8 p-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            LeadCapture Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Crie páginas de captura profissionais com formulários personalizáveis
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-glow rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="w-80 mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-3">
              <span>Carregando interface</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-soft">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500 ease-out rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};