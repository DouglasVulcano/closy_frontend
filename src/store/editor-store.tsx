import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  FormField,
  CampaignData,
  EditorState,
  EditorAction,
  EditorContextType
} from './editor-types';

// Re-export types for backward compatibility
export type { FormField, CampaignData } from './editor-types';

const initialState: EditorState = {
  campaign: {
    title: 'Sua Nova Campanha',
    description: 'Descreva sua campanha aqui. Explique os benefícios e o que o usuário irá receber.',
    backgroundColor: '#f8f9ff',
    textColor: '#2d1b69',
    accentColor: '#8b7cf8',
    formFields: [
      {
        id: '1',
        type: 'text',
        label: 'Nome completo',
        placeholder: 'Digite seu nome',
        required: true,
      },
      {
        id: '2',
        type: 'email',
        label: 'E-mail',
        placeholder: 'seu@email.com',
        required: true,
      }
    ]
  },
  selectedElement: null,
  previewMode: false,
  isDirty: false,
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaign: { ...state.campaign, ...action.payload },
        isDirty: true,
      };
    
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload,
      };
    
    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        previewMode: !state.previewMode,
      };
    
    case 'ADD_FORM_FIELD':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          formFields: [...state.campaign.formFields, action.payload],
        },
        isDirty: true,
      };
    
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          formFields: state.campaign.formFields.map(field =>
            field.id === action.payload.id
              ? { ...field, ...action.payload.field }
              : field
          ),
        },
        isDirty: true,
      };
    
    case 'REMOVE_FORM_FIELD':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          formFields: state.campaign.formFields.filter(field => field.id !== action.payload),
        },
        isDirty: true,
      };
    
    case 'REORDER_FORM_FIELDS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          formFields: action.payload,
        },
        isDirty: true,
      };
    
    case 'MARK_CLEAN':
      return {
        ...state,
        isDirty: false,
      };
    
    default:
      return state;
  }
};



export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const updateCampaign = (data: Partial<CampaignData>) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: data });
  };

  const selectElement = (id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  };

  const togglePreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  };

  const addFormField = (field: FormField) => {
    dispatch({ type: 'ADD_FORM_FIELD', payload: field });
  };

  const updateFormField = (id: string, field: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FORM_FIELD', payload: { id, field } });
  };

  const removeFormField = (id: string) => {
    dispatch({ type: 'REMOVE_FORM_FIELD', payload: id });
  };

  const reorderFormFields = (fields: FormField[]) => {
    dispatch({ type: 'REORDER_FORM_FIELDS', payload: fields });
  };

  const markClean = () => {
    dispatch({ type: 'MARK_CLEAN' });
  };

  return (
    <EditorContext.Provider
      value={{
        state,
        updateCampaign,
        selectElement,
        togglePreview,
        addFormField,
        updateFormField,
        removeFormField,
        reorderFormFields,
        markClean,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};