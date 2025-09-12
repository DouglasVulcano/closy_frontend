import { useState } from 'react';
import { EditorProvider } from '@/store/editor-store';
import { EditorSidebar } from './editor/EditorSidebar';
import { FloatingMenu } from './editor/FloatingMenu';
import { Canvas } from './editor/Canvas';
import { useIsMobile } from '@/hooks/use-mobile';

export const LeadCaptureBuilder = () => {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleToggleFloatingMenu = () => {
    setIsFloatingMenuOpen(!isFloatingMenuOpen);
  };

  return (
    <EditorProvider>
      <div className="flex h-screen bg-editor-bg overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!isMobile && <EditorSidebar />}
        
        {/* Mobile Floating Menu */}
        {isMobile && (
          <FloatingMenu
            isOpen={isFloatingMenuOpen}
            onToggle={handleToggleFloatingMenu}
          />
        )}
        
        {/* Canvas */}
        <Canvas />
      </div>
    </EditorProvider>
  );
};