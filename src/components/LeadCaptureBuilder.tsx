import { EditorProvider } from '@/store/editor-store';
import { EditorSidebar } from './editor/EditorSidebar';
import { Canvas } from './editor/Canvas';

export const LeadCaptureBuilder = () => {
  return (
    <EditorProvider>
      <div className="flex h-screen bg-editor-bg overflow-hidden">
        <EditorSidebar />
        <Canvas />
      </div>
    </EditorProvider>
  );
};