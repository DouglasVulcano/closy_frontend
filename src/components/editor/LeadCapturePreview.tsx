import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CampaignData, FormField } from '@/store/editor-store';

interface LeadCapturePreviewProps {
  campaign: CampaignData;
  viewport: 'mobile' | 'tablet' | 'desktop';
  isPreview?: boolean;
}

type FormDataValue = string | boolean;

export const LeadCapturePreview = ({ campaign, viewport, isPreview = false }: LeadCapturePreviewProps) => {
  const [formData, setFormData] = useState<Record<string, FormDataValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (fieldId: string, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPreview) {
      // Simulate form submission in preview mode
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast({
          title: "Sucesso!",
          description: "Lead capturado com sucesso (simulação)",
        });
        
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({});
        }, 3000);
      }, 1500);
      
      return;
    }

    // Validate required fields
    const errors: string[] = [];
    campaign.formFields.forEach((field: FormField) => {
      if (field.required && !formData[field.id]) {
        errors.push(field.label);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha: ${errors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Submit form data
    setIsSubmitting(true);
    try {
      // Here you would send the data to your backend
      console.log('Form submission:', formData);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast({
          title: "Sucesso!",
          description: "Seus dados foram enviados com sucesso!",
        });
      }, 1500);
    } catch (error: unknown) {
      setIsSubmitting(false);
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const baseProps = {
      id: field.id,
      required: field.required,
      placeholder: field.placeholder,
      className: "focus-ring",
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            {...baseProps}
            type={field.type}
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      
      case 'phone':
        return (
          <Input
            {...baseProps}
            type="tel"
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            {...baseProps}
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={3}
            className="focus-ring resize-none"
          />
        );
      
      case 'select':
        return (
          <Select
            value={(formData[field.id] as string) || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 py-2">
            <Checkbox
              id={field.id}
              checked={(formData[field.id] as boolean) || false}
              onCheckedChange={(checked) => handleInputChange(field.id, !!checked)}
              className="mt-1"
            />
            <label 
              htmlFor={field.id}
              className="text-sm leading-5 cursor-pointer"
              style={{ color: campaign.textColor }}
            >
              {field.label}
            </label>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div 
        className="min-h-full flex items-center justify-center p-6"
        style={{ backgroundColor: campaign.backgroundColor }}
      >
        <Card className="max-w-md w-full p-8 text-center space-y-6 glass">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: campaign.textColor }}
            >
              Obrigado!
            </h2>
            <p 
              className="text-base opacity-90"
              style={{ color: campaign.textColor }}
            >
              Recebemos suas informações e entraremos em contato em breve.
            </p>
          </div>
          
          {isPreview && (
            <Badge variant="secondary" className="mt-4">
              Modo Preview
            </Badge>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-full"
      style={{ backgroundColor: campaign.backgroundColor }}
    >
      {/* Campaign Header */}
      <div className="px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 
            className={`text-4xl md:text-5xl font-bold leading-tight ${viewport === 'mobile' ? 'text-3xl' : ''}`}
            style={{ color: campaign.textColor }}
          >
            {campaign.title}
          </h1>
          
          <p 
            className={`text-lg md:text-xl leading-relaxed opacity-90 ${viewport === 'mobile' ? 'text-base' : ''}`}
            style={{ color: campaign.textColor }}
          >
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-6 pb-12">
        <Card className="max-w-md mx-auto p-6 glass">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: campaign.textColor }}
              >
                Cadastre-se agora
              </h3>
              <p 
                className="text-sm opacity-80"
                style={{ color: campaign.textColor }}
              >
                Preencha os dados abaixo
              </p>
            </div>

            {campaign.formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                {field.type !== 'checkbox' && (
                  <label 
                    htmlFor={field.id}
                    className="block text-sm font-medium"
                    style={{ color: campaign.textColor }}
                  >
                    {field.label}
                    {field.required && (
                      <span style={{ color: campaign.accentColor }}>*</span>
                    )}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 font-semibold py-3 transition-all hover-lift"
              style={{ 
                backgroundColor: campaign.accentColor,
                color: 'white',
                borderColor: campaign.accentColor
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Dados
                </>
              )}
            </Button>
          </form>

          {isPreview && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="text-xs">
                Preview Mode
              </Badge>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center">
        <p 
          className="text-sm opacity-60"
          style={{ color: campaign.textColor }}
        >
          Seus dados estão seguros conosco
        </p>
      </div>
    </div>
  );
};