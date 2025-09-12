import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit3, Type, Mail, Phone, MessageSquare, List, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useEditor, FormField } from '@/store/editor-store';

const FIELD_TYPES = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'phone', label: 'Telefone', icon: Phone },
  { value: 'textarea', label: 'Texto longo', icon: MessageSquare },
  { value: 'select', label: 'Seleção', icon: List },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
] as const;

export const FormFieldEditor = () => {
  const { state, addFormField, updateFormField, removeFormField } = useEditor();
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
  });

  const handleAddField = () => {
    if (!newField.label) return;

    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.type === 'select' ? newField.options : undefined,
    };

    addFormField(field);
    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
    });
    setIsAddingField(false);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
  };

  const handleUpdateField = () => {
    if (!editingField) return;

    updateFormField(editingField.id, editingField);
    setEditingField(null);
  };

  const getFieldIcon = (type: FormField['type']) => {
    const fieldType = FIELD_TYPES.find(t => t.value === type);
    return fieldType?.icon || Type;
  };

  return (
    <div className="space-y-4">
      {/* Existing Fields */}
      <div className="space-y-2">
        {state.campaign.formFields.map((field, index) => {
          const Icon = getFieldIcon(field.type);
          
          return (
            <Card key={field.id} className="p-3 border-border">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <Icon className="h-4 w-4 text-primary" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{field.label}</span>
                    {field.required && (
                      <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {FIELD_TYPES.find(t => t.value === field.type)?.label}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditField(field)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFormField(field.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Field Button */}
      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2" onClick={() => setIsAddingField(true)}>
            <Plus className="h-4 w-4" />
            Adicionar Campo
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Campo do Formulário</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-type">Tipo do Campo</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as FormField['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-label">Rótulo do Campo</Label>
              <Input
                id="field-label"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="Ex: Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-placeholder">Texto de Exemplo</Label>
              <Input
                id="field-placeholder"
                value={newField.placeholder}
                onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                placeholder="Ex: Digite seu nome"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="field-required">Campo obrigatório</Label>
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddField} disabled={!newField.label} className="flex-1">
                Adicionar Campo
              </Button>
              <Button variant="outline" onClick={() => setIsAddingField(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Campo</DialogTitle>
          </DialogHeader>
          
          {editingField && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-field-type">Tipo do Campo</Label>
                <Select
                  value={editingField.type}
                  onValueChange={(value) => setEditingField({ ...editingField, type: value as FormField['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-field-label">Rótulo do Campo</Label>
                <Input
                  id="edit-field-label"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  placeholder="Ex: Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-field-placeholder">Texto de Exemplo</Label>
                <Input
                  id="edit-field-placeholder"
                  value={editingField.placeholder}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  placeholder="Ex: Digite seu nome"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-field-required">Campo obrigatório</Label>
                <Switch
                  id="edit-field-required"
                  checked={editingField.required}
                  onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateField} className="flex-1">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setEditingField(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
