import { useContext } from 'react';
import { EditorContext } from './editor-store';
import { EditorContextType } from './editor-types';

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};