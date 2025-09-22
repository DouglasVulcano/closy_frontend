import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    BarChart3,
    Users,
    TrendingUp,
    Megaphone,
    Settings,
    ToggleLeft,
    ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

import { Link } from 'react-router-dom';
import { campaignsService, CampaignFilters, CampaignStatistics } from '../services/campaigns.service';
import { Campaign, PaginatedResponse } from '../types/api';
import { DataPagination } from '../components/ui/data-pagination';
import { CampaignsPageSkeleton } from '../components/skeletons';
import { useToast } from '../hooks/use-toast';
import { useConfirm } from '../hooks/useConfirm';
import { useDebounce } from '../hooks/useDebounce';
import { CampaignStatusDialog } from '../components/campaigns/CampaignStatusDialog';
import { CampaignModal, CampaignFormData } from '../components/campaigns/CampaignModal';

type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

const statusConfig = {
    active: { label: 'Ativa', variant: 'default' as const, color: 'text-green-600' },
    paused: { label: 'Pausada', variant: 'secondary' as const, color: 'text-yellow-600' },
    draft: { label: 'Rascunho', variant: 'outline' as const, color: 'text-gray-600' },
    completed: { label: 'Concluída', variant: 'secondary' as const, color: 'text-blue-600' },
};

const Campaigns = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Debounce da busca para evitar muitas requisições
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginatedResponse<Campaign> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedCampaignForStatus, setSelectedCampaignForStatus] = useState<Campaign | null>(null);
    const [statistics, setStatistics] = useState<CampaignStatistics | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const { toast } = useToast();
    const { confirm, ConfirmComponent } = useConfirm();

    // Função para carregar campanhas
    const loadCampaigns = useCallback(async () => {
        try {
            setIsLoading(true);
            const filters: CampaignFilters = {
                page: currentPage,
                per_page: 10
            };

            if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }

            if (debouncedSearchTerm.trim()) {
                filters.title = debouncedSearchTerm.trim();
            }

            const response = await campaignsService.getCampaigns(filters);
            setCampaigns(response.data);
            setPagination(response);
        } catch (error) {
            console.error('Erro ao carregar campanhas:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, debouncedSearchTerm]);

    // Função para carregar estatísticas
    const loadStatistics = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            const response = await campaignsService.getStatistics();
            setStatistics(response);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setIsLoadingStats(false);
        }
    }, []);

    // Carregar campanhas quando o componente montar ou filtros mudarem
    useEffect(() => {
        loadCampaigns();
    }, [currentPage, statusFilter, debouncedSearchTerm, loadCampaigns]);

    // Carregar estatísticas quando o componente montar
    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    // Função para salvar campanha (criação ou edição)
    const handleSaveCampaign = async (data: CampaignFormData) => {
        try {
            setIsUploading(true);

            if (editingCampaign) {
                // Modo edição
                await campaignsService.updateCampaign(editingCampaign.id, data);
                toast({
                    title: "Campanha atualizada",
                    description: `A campanha "${data.title}" foi atualizada com sucesso.`,
                });
            } else {
                // Modo criação
                await campaignsService.createCampaign(data);
                toast({
                    title: "Campanha criada",
                    description: `A campanha "${data.title}" foi criada com sucesso.`,
                });
            }

            setIsCampaignModalOpen(false);
            setEditingCampaign(null);
            loadCampaigns(); // Recarregar a lista
            loadStatistics(); // Recarregar estatísticas
        } catch (error) {
            console.error('Erro ao salvar campanha:', error);
            toast({
                title: "Erro",
                description: editingCampaign
                    ? "Não foi possível atualizar a campanha."
                    : "Não foi possível criar a campanha.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Função para abrir modal de criação
    const handleOpenCreateModal = () => {
        setEditingCampaign(null);
        setIsCampaignModalOpen(true);
    };

    // Função para abrir modal de edição
    const handleOpenEditModal = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setIsCampaignModalOpen(true);
    };

    // Função para fechar modal
    const handleCloseModal = () => {
        setIsCampaignModalOpen(false);
        setEditingCampaign(null);
    };

    const filteredCampaigns = campaigns;

    // Usar campanhas filtradas diretamente
    const sortedCampaigns = filteredCampaigns;

    const handleStatusChange = async (campaignId: number, newStatus: CampaignStatus) => {
        try {
            const campaign = campaigns.find(c => c.id === campaignId);
            if (!campaign) return;

            // Se o status não mudou, não fazer nada
            if (campaign.status === newStatus) return;

            // Verificações específicas para cada status
            let needsConfirmation = false;
            let confirmationConfig = {
                title: '',
                description: '',
                confirmText: 'Continuar',
                cancelText: 'Cancelar',
                variant: 'default' as const
            };

            // Verificar se a data de início é maior que o horário atual ao ativar
            if (newStatus === 'active' && campaign.start_date) {
                const startDate = new Date(campaign.start_date);
                const now = new Date();
                if (startDate > now) {
                    needsConfirmation = true;
                    confirmationConfig = {
                        title: 'Alterar data de início',
                        description: 'A data de início configurada será alterada para o horário atual. Deseja continuar?',
                        confirmText: 'Continuar',
                        cancelText: 'Cancelar',
                        variant: 'default'
                    };
                }
            }

            // Confirmação para marcar como concluída
            if (newStatus === 'completed') {
                needsConfirmation = true;
                confirmationConfig = {
                    title: 'Marcar como concluída',
                    description: 'Tem certeza que deseja marcar esta campanha como concluída? Campanhas concluídas param de coletar leads.',
                    confirmText: 'Marcar como concluída',
                    cancelText: 'Cancelar',
                    variant: 'default'
                };
            }

            // Confirmação para voltar para rascunho se estava ativa
            if (newStatus === 'draft' && campaign.status === 'active') {
                needsConfirmation = true;
                confirmationConfig = {
                    title: 'Voltar para rascunho',
                    description: 'A campanha ativa será pausada e voltará para o estado de rascunho. Deseja continuar?',
                    confirmText: 'Continuar',
                    cancelText: 'Cancelar',
                    variant: 'default'
                };
            }

            // Mostrar confirmação se necessário
            if (needsConfirmation) {
                const confirmed = await confirm(confirmationConfig);
                if (!confirmed) return;
            }

            // Atualizar status
            await campaignsService.updateCampaignStatus(campaignId, newStatus);

            // Recarregar a lista completa para garantir sincronização
            await loadCampaigns();
            loadStatistics(); // Recarregar estatísticas

            toast({
                title: "Status atualizado",
                description: `Campanha "${campaign.title}" agora está ${statusConfig[newStatus].label.toLowerCase()}.`,
            });

        } catch (error) {
            console.error('Erro ao alterar status da campanha:', error);
            toast({
                title: "Erro",
                description: "Não foi possível alterar o status da campanha.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (campaignId: number) => {
        try {
            const campaign = campaigns.find(c => c.id === campaignId);
            if (!campaign) return;

            // Confirmar deleção
            const confirmed = await confirm({
                title: 'Excluir campanha',
                description: `Tem certeza que deseja excluir a campanha "${campaign.title}"? Esta ação não pode ser desfeita.`,
                confirmText: 'Excluir',
                cancelText: 'Cancelar',
                variant: 'destructive'
            });
            if (!confirmed) return;

            // Excluir campanha
            await campaignsService.deleteCampaign(campaignId);

            // Remover da lista local
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));

            toast({
                title: "Campanha excluída",
                description: `A campanha "${campaign.title}" foi excluída com sucesso.`,
            });

            // Recarregar a lista para atualizar a paginação
            loadCampaigns();
            loadStatistics(); // Recarregar estatísticas

        } catch (error) {
            console.error('Erro ao excluir campanha:', error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir a campanha.",
                variant: "destructive",
            });
        }
    };

    const handleOpenStatusDialog = (campaign: Campaign) => {
        setSelectedCampaignForStatus(campaign);
        setStatusDialogOpen(true);
    };

    const handleCloseStatusDialog = () => {
        setStatusDialogOpen(false);
        setSelectedCampaignForStatus(null);
    };

    // Renderizar skeleton durante o loading
    if (isLoading) {
        return <CampaignsPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Campanhas</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas campanhas de captação de leads
                    </p>
                </div>
                <Button onClick={handleOpenCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Campanha
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? '...' : statistics?.total_campaigns || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoadingStats ? '...' : statistics?.total_active_campaigns || 0} ativas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Leads no mês</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? '...' : (statistics?.total_leads_this_month || 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? '...' : (statistics?.total_leads || 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Todos os tempos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa Média de Conversão</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? '...' : statistics?.total_leads_conversion || '0%'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Média geral
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar campanhas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CampaignStatus | 'all')}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="active">Ativas</SelectItem>
                                    <SelectItem value="paused">Pausadas</SelectItem>
                                    <SelectItem value="draft">Rascunhos</SelectItem>
                                    <SelectItem value="completed">Concluídas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sortedCampaigns.map((campaign) => (
                            <Card key={campaign.id} className="hover-lift group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base truncate">{campaign.title}</CardTitle>
                                                <Badge
                                                    variant={statusConfig[campaign.status].variant}
                                                    className="mt-1"
                                                >
                                                    {statusConfig[campaign.status].label}
                                                </Badge>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenEditModal(campaign)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenStatusDialog(campaign)}>
                                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                                    Alterar Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/campaigns/edit/${campaign.id}`}>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Edição Avançada
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-semibold">{campaign.leads_count}</div>
                                            <div className="text-xs text-muted-foreground">Leads</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold">{campaign.conversion}%</div>
                                            <div className="text-xs text-muted-foreground">Conversão</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Atualizada em</span>
                                            <span>{new Date(campaign.updated_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {sortedCampaigns.length === 0 && (
                        <div className="text-center py-12">
                            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Nenhuma campanha encontrada</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Crie sua primeira campanha para começar a capturar leads'
                                }
                            </p>
                            <Button onClick={handleOpenCreateModal}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Campanha
                            </Button>
                        </div>
                    )}

                    {/* Paginação */}
                    {pagination && (
                        <DataPagination
                            pagination={pagination}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            itemName="campanhas"
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modal reutilizável para criação e edição */}
            <CampaignModal
                isOpen={isCampaignModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCampaign}
                campaign={editingCampaign}
                isLoading={isUploading}
            />

            {/* Componente de Confirmação Global */}
            <ConfirmComponent />

            {/* Dialog de alteração de status */}
            {selectedCampaignForStatus && (
                <CampaignStatusDialog
                    isOpen={statusDialogOpen}
                    onClose={handleCloseStatusDialog}
                    currentStatus={selectedCampaignForStatus.status}
                    campaignTitle={selectedCampaignForStatus.title}
                    onStatusChange={(newStatus) => handleStatusChange(selectedCampaignForStatus.id, newStatus)}
                />
            )}


        </div>
    );
};

export default Campaigns;