import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/store/editor-hooks';
import { LeadCapturePreview } from './LeadCapturePreview';
import { useNavigate } from 'react-router-dom';

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const VIEWPORTS = {
  mobile: { width: 375, height: 812, label: 'Mobile', icon: Smartphone },
  tablet: { width: 768, height: 1024, label: 'Tablet', icon: Tablet },
  desktop: { width: 1200, height: 800, label: 'Desktop', icon: Monitor },
};

export const Canvas = () => {
  const { state } = useEditor();
  const [viewport, setViewport] = useState<ViewportSize>('mobile');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentViewport = VIEWPORTS[viewport];

  return (
    <div className="flex-1 bg-editor-bg flex flex-col">
      {/* Viewport Controls - Hidden on Mobile */}
      {!isMobile && (
        <div className="border-b border-border bg-toolbar-bg px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
                {Object.entries(VIEWPORTS).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <Button
                      key={key}
                      variant={viewport === key ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewport(key as ViewportSize)}
                      className="gap-2 px-3"
                    >
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>

              <div className="text-sm text-muted-foreground">
                {currentViewport.width} × {currentViewport.height}px
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/campaigns')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Campanhas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header - Simple back button */}
      {isMobile && (
        <div className="border-b border-border bg-toolbar-bg px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/campaigns')}
              className="gap-2 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            <Badge variant="secondary" className="gap-2 text-xs">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              Preview
            </Badge>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className={`flex-1 overflow-auto ${isMobile
          ? 'p-0'
          : 'flex items-center justify-center p-6'
        }`}>
        {isMobile ? (
          // Mobile: Full screen preview
          <div className="w-full h-full">
            <LeadCapturePreview
              campaign={state.campaign}
              viewport="mobile"
              isPreview={true}
            />
          </div>
        ) : (
          // Desktop: Card with viewport simulation
          <Card
            className="bg-canvas-bg border-border shadow-large transition-all duration-300"
            style={{
              width: currentViewport.width,
              height: currentViewport.height,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              {/* Device Frame for Mobile */}
              {viewport === 'mobile' && (
                <div className="absolute inset-x-0 top-0 h-6 bg-background border-b border-border flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-foreground rounded-full"></div>
                    <div className="w-12 h-3 bg-muted rounded-full"></div>
                    <div className="w-1 h-1 bg-foreground rounded-full"></div>
                  </div>
                </div>
              )}

              {/* Scrollable Preview Content */}
              <div
                className="w-full h-full overflow-y-auto"
                style={{
                  paddingTop: viewport === 'mobile' ? '24px' : '0',
                }}
              >
                <LeadCapturePreview
                  campaign={state.campaign}
                  viewport={viewport}
                  isPreview={true}
                />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Canvas Footer - Hidden on Mobile */}
      {!isMobile && (
        <div className="border-t border-border bg-toolbar-bg px-6 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Zoom: 100%</span>
            <div className="flex items-center gap-4">
              <span>Campos do formulário: {state.campaign.formFields.length}</span>
              <span>Última atualização: agora</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};