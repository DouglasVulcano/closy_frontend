import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { leadsService, type LeadFilters, type LeadStatistics } from '@/services/leads.service';
import { campaignsService } from '@/services/campaigns.service';
import { detectSearchType } from '@/lib/utils';
import type { Lead, Campaign, PaginatedResponse } from '@/types/api';
import { DataPagination } from '@/components/ui/data-pagination';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce da busca para evitar muitas requisições
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Estados para dados da API
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginatedResponse<Lead> | null>(null);
  const [statistics, setStatistics] = useState<LeadStatistics | null>(null);

  // Função para buscar leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);

      const filters: LeadFilters = {
        status: statusFilter !== 'all' ? statusFilter as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' : undefined,
        campaign_id: campaignFilter !== 'all' ? parseInt(campaignFilter) : undefined,
        page: currentPage,
        per_page: 10
      };

      // Adicionar filtro de busca baseado no tipo detectado
      if (debouncedSearchQuery.trim()) {
        const { isEmail, value } = detectSearchType(debouncedSearchQuery);
        if (isEmail) {
          filters.email = value;
        } else {
          filters.name = value;
        }
      }

      const response = await leadsService.getLeads(filters);
      setLeads(response.data);
      setPagination(response);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      setLeads([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, campaignFilter, currentPage]);

  // Função para buscar campanhas
  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await campaignsService.getCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
    }
  }, []);

  // Função para buscar estatísticas
  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await leadsService.getLeadStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchCampaigns();
    fetchStatistics();
  }, [fetchCampaigns, fetchStatistics]);

  // Efeito para aplicar filtros e paginação
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, campaignFilter]);

  const filteredLeads = leads; // Agora os filtros são aplicados na API

  const sortedLeads = [...filteredLeads]; // Ordenação será implementada na API futuramente

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(sortedLeads.map(lead => lead.id.toString()));
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

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await leadsService.updateLeadStatus(leadId, newStatus as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost');
      // Recarregar leads após atualização
      fetchLeads();
    } catch (error) {
      console.error(`Erro ao alterar status do lead ${leadId}:`, error);
    }
  };

  const handleDelete = async (leadId: number) => {
    try {
      await leadsService.deleteLead(leadId);
      // Recarregar leads após exclusão
      fetchLeads();
    } catch (error) {
      console.error(`Erro ao excluir lead ${leadId}:`, error);
    }
  };

  const getStatusStats = () => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const statusStats = getStatusStats();

  // Função para obter nome da campanha
  const getCampaignName = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.title || `Campanha ${campaignId}`;
  };

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.total || 0}</div>
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
            <div className="text-2xl font-bold">{statistics?.new || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando contato
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatados</CardTitle>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.contacted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.qualified || 0}</div>
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
            <div className="text-2xl font-bold">{statistics?.converted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Taxa de Conversão: {statistics?.total_leads_conversion || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perdidos</CardTitle>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.lost || 0}</div>
            <p className="text-xs text-muted-foreground">
              Não convertidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden md:flex gap-2">
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
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id.toString()}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filters - Mobile */}
            <div className="md:hidden space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as campanhas</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedLeads.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  {selectedLeads.length} lead(s) selecionado(s)
                </span>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Tag className="h-4 w-4 mr-1" />
                    Tag
                  </Button>
                </div>
                <Button size="sm" variant="outline" onClick={handleExport} className="w-full text-xs">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Selecionados
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
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
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id.toString())}
                          onCheckedChange={(checked) => handleSelectLead(lead.id.toString(), checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{lead.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{lead.email}</div>
                            {lead.celular && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.celular}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getCampaignName(lead.campaign_id)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[lead.status].variant}>
                          {statusConfig[lead.status].label}
                        </Badge>
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
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {sortedLeads.map((lead) => (
              <Card key={lead.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={selectedLeads.includes(lead.id.toString())}
                        onCheckedChange={(checked) => handleSelectLead(lead.id.toString(), checked as boolean)}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Campanha:</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[60%]">
                        {getCampaignName(lead.campaign_id)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={statusConfig[lead.status].variant} className="text-xs">
                        {statusConfig[lead.status].label}
                      </Badge>
                    </div>

                    {lead.celular && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Telefone:</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {lead.celular}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    {lead.celular && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
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

          {/* Paginação */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-6">
              <DataPagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemName="leads"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;