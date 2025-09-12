export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface CampaignData {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage?: string;
  logo?: string;
  formFields: FormField[];
  formHeader?: string;
  formSubtitle?: string;
  submitButtonLabel?: string;
  successMessage?: string;
}

export interface EditorState {
  campaign: CampaignData;
  selectedElement: string | null;
  previewMode: boolean;
  isDirty: boolean;
}

export type EditorAction =
  | { type: 'UPDATE_CAMPAIGN'; payload: Partial<CampaignData> }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'ADD_FORM_FIELD'; payload: FormField }
  | { type: 'UPDATE_FORM_FIELD'; payload: { id: string; field: Partial<FormField> } }
  | { type: 'REMOVE_FORM_FIELD'; payload: string }
  | { type: 'REORDER_FORM_FIELDS'; payload: FormField[] }
  | { type: 'MARK_CLEAN' }
  | { type: 'LOAD_FROM_JSON'; payload: CampaignData };

export interface EditorContextType {
  state: EditorState;
  updateCampaign: (data: Partial<CampaignData>) => void;
  selectElement: (id: string | null) => void;
  togglePreview: () => void;
  addFormField: (field: FormField) => void;
  updateFormField: (id: string, field: Partial<FormField>) => void;
  removeFormField: (id: string) => void;
  reorderFormFields: (fields: FormField[]) => void;
  markClean: () => void;
  loadFromJson: (data: CampaignData) => void;
  exportToJson: () => string;
}