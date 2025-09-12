import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  campaign: string;
  campaignId: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  tags: string[];
  createdAt: string;
  lastContact?: string;
  location?: string;
  avatar?: string;
  notes?: string;
}

const leads: Lead[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    phone: '+55 11 99999-9999',
    campaign: 'Black Friday 2024',
    campaignId: '1',
    source: 'Instagram',
    status: 'new',
    tags: ['vip', 'interessado'],
    createdAt: '2024-01-15T10:30:00Z',
    location: 'São Paulo, SP',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@exemplo.com',
    phone: '+55 21 88888-8888',
    campaign: 'Webinar Marketing Digital',
    campaignId: '2',
    source: 'Facebook',
    status: 'contacted',
    tags: ['empresário'],
    createdAt: '2024-01-15T09:15:00Z',
    lastContact: '2024-01-15T14:20:00Z',
    location: 'Rio de Janeiro, RJ',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@exemplo.com',
    campaign: 'E-book Gratuito',
    campaignId: '3',
    source: 'Google',
    status: 'qualified',
    tags: ['marketing', 'interessado'],
    createdAt: '2024-01-15T08:45:00Z',
    lastContact: '2024-01-15T16:30:00Z',
    location: 'Belo Horizonte, MG',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@exemplo.com',
    phone: '+55 85 77777-7777',
    campaign: 'Newsletter Semanal',
    campaignId: '5',
    source: 'LinkedIn',
    status: 'converted',
    tags: ['cliente', 'premium'],
    createdAt: '2024-01-14T16:20:00Z',
    lastContact: '2024-01-15T10:00:00Z',
    location: 'Fortaleza, CE',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Carla Mendes',
    email: 'carla.mendes@exemplo.com',
    campaign: 'Black Friday 2024',
    campaignId: '1',
    source: 'TikTok',
    status: 'lost',
    tags: ['não interessado'],
    createdAt: '2024-01-14T11:10:00Z',
    lastContact: '2024-01-14T15:45:00Z',
    location: 'Porto Alegre, RS',
    avatar: '/placeholder.svg'
  },
];

const statusConfig = {
  new: { label: 'Novo', variant: 'default' as const, color: 'bg-blue-500' },
  contacted: { label: 'Contatado', variant: 'secondary' as const, color: 'bg-yellow-500' },
  qualified: { label: 'Qualificado', variant: 'default' as const, color: 'bg-purple-500' },
  converted: { label: 'Convertido', variant: 'default' as const, color: 'bg-green-500' },
  lost: { label: 'Perdido', variant: 'destructive' as const, color: 'bg-red-500' },
};

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('created');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || lead.campaignId === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'campaign':
        return a.campaign.localeCompare(b.campaign);
      case 'status':
        return a.status.localeCompare(b.status);
      default: // created
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(sortedLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleExport = () => {
    // Aqui você implementaria a lógica de exportação
    console.log('Exportando leads:', selectedLeads.length > 0 ? selectedLeads : 'todos');
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    // Aqui você implementaria a lógica para alterar o status do lead
    console.log(`Alterando status do lead ${leadId} para ${newStatus}`);
  };

  const handleDelete = (leadId: string) => {
    // Aqui você implementaria a lógica para excluir o lead
    console.log(`Excluindo lead ${leadId}`);
  };

  const getStatusStats = () => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Gerencie todos os contatos capturados pelas suas campanhas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              Todos os contatos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos</CardTitle>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.new || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando contato
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.qualified || 0}</div>
            <p className="text-xs text-muted-foreground">
              Prontos para venda
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.converted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Viraram clientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0 ? ((statusStats.converted || 0) / leads.length * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Leads → Clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou campanha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Novos</SelectItem>
                  <SelectItem value="contacted">Contatados</SelectItem>
                  <SelectItem value="qualified">Qualificados</SelectItem>
                  <SelectItem value="converted">Convertidos</SelectItem>
                  <SelectItem value="lost">Perdidos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Campanha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Black Friday 2024</SelectItem>
                  <SelectItem value="2">Webinar Marketing</SelectItem>
                  <SelectItem value="3">E-book Gratuito</SelectItem>
                  <SelectItem value="5">Newsletter</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Mais recentes</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="campaign">Campanha</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedLeads.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedLeads.length} lead(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button size="sm" variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  Adicionar Tag
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeads.length === sortedLeads.length && sortedLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback>
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{lead.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{lead.email}</div>
                          {lead.phone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.campaign}</div>
                      {lead.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[lead.status].variant}>
                        {statusConfig[lead.status].label}
                      </Badge>
                      {lead.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {lead.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {lead.lastContact && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          Último contato: {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'contacted')}>
                            Marcar como contatado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'qualified')}>
                            Marcar como qualificado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'converted')}>
                            Marcar como convertido
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(lead.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sortedLeads.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum lead encontrado</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || campaignFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Seus leads aparecerão aqui quando suas campanhas começarem a capturar contatos'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;