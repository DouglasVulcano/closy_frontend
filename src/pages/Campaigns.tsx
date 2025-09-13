import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Copy,
    Trash2,
    Play,
    Pause,
    BarChart3,
    Users,
    TrendingUp,
    Megaphone,
    X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

interface Campaign {
    id: string;
    name: string;
    description: string;
    status: CampaignStatus;
    leads: number;
    views: number;
    conversion: number;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
}

const campaigns: Campaign[] = [
    {
        id: '1',
        name: 'Campanha Black Friday 2024',
        description: 'Promoção especial para Black Friday com desconto de 50%',
        status: 'active',
        leads: 234,
        views: 5600,
        conversion: 4.2,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        thumbnail: '/placeholder.svg'
    },
    {
        id: '2',
        name: 'Webinar Marketing Digital',
        description: 'Webinar gratuito sobre estratégias de marketing digital',
        status: 'active',
        leads: 156,
        views: 4100,
        conversion: 3.8,
        createdAt: '2024-01-12T09:00:00Z',
        updatedAt: '2024-01-14T16:20:00Z',
        thumbnail: '/placeholder.svg'
    },
    {
        id: '3',
        name: 'E-book Gratuito',
        description: 'Download gratuito do nosso e-book sobre vendas',
        status: 'paused',
        leads: 89,
        views: 4200,
        conversion: 2.1,
        createdAt: '2024-01-10T11:00:00Z',
        updatedAt: '2024-01-13T10:15:00Z',
        thumbnail: '/placeholder.svg'
    },
    {
        id: '4',
        name: 'Curso Online',
        description: 'Inscrições para o curso online de empreendedorismo',
        status: 'draft',
        leads: 0,
        views: 0,
        conversion: 0,
        createdAt: '2024-01-08T15:00:00Z',
        updatedAt: '2024-01-08T15:00:00Z',
        thumbnail: '/placeholder.svg'
    },
    {
        id: '5',
        name: 'Newsletter Semanal',
        description: 'Cadastro para receber nossa newsletter semanal',
        status: 'completed',
        leads: 1200,
        views: 15000,
        conversion: 8.0,
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        thumbnail: '/placeholder.svg'
    },
];

const statusConfig = {
    active: { label: 'Ativa', variant: 'default' as const, color: 'text-green-600' },
    paused: { label: 'Pausada', variant: 'secondary' as const, color: 'text-yellow-600' },
    draft: { label: 'Rascunho', variant: 'outline' as const, color: 'text-gray-600' },
    completed: { label: 'Concluída', variant: 'secondary' as const, color: 'text-blue-600' },
};

const Campaigns = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('updated');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        title: '',
        url: ''
    });

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'leads':
                return b.leads - a.leads;
            case 'conversion':
                return b.conversion - a.conversion;
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default: // updated
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });

    const handleStatusChange = (campaignId: string, newStatus: CampaignStatus) => {
        // Aqui você implementaria a lógica para alterar o status da campanha
        console.log(`Alterando status da campanha ${campaignId} para ${newStatus}`);
    };

    const handleDelete = (campaignId: string) => {
        // Aqui você implementaria a lógica para excluir a campanha
        console.log(`Excluindo campanha ${campaignId}`);
    };

    const handleCreateCampaign = () => {
        if (newCampaign.title.trim() && newCampaign.url.trim()) {
            // Aqui você implementaria a lógica para criar a campanha
            console.log('Criando nova campanha:', newCampaign);
            setIsModalOpen(false);
            setNewCampaign({ title: '', url: '' });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewCampaign({ title: '', url: '' });
    };

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
                <Button onClick={() => setIsModalOpen(true)}>
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
                        <div className="text-2xl font-bold">{campaigns.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {campaigns.filter(c => c.status === 'active').length} ativas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {campaigns.reduce((sum, c) => sum + c.leads, 0).toLocaleString()}
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
                            {(campaigns.reduce((sum, c) => sum + c.conversion, 0) / campaigns.length).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Média geral
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(campaigns.reduce((sum, c) => sum + c.views, 0) / 1000).toFixed(1)}k
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total de views
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
                                    <SelectItem value="active">Ativas</SelectItem>
                                    <SelectItem value="paused">Pausadas</SelectItem>
                                    <SelectItem value="draft">Rascunhos</SelectItem>
                                    <SelectItem value="completed">Concluídas</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Ordenar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="updated">Mais recentes</SelectItem>
                                    <SelectItem value="created">Data de criação</SelectItem>
                                    <SelectItem value="name">Nome</SelectItem>
                                    <SelectItem value="leads">Mais leads</SelectItem>
                                    <SelectItem value="conversion">Conversão</SelectItem>
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
                                                <CardTitle className="text-base truncate">{campaign.name}</CardTitle>
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
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/campaigns/${campaign.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Visualizar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/campaigns/edit/${campaign.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {campaign.status === 'active' ? (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'paused')}>
                                                        <Pause className="mr-2 h-4 w-4" />
                                                        Pausar
                                                    </DropdownMenuItem>
                                                ) : campaign.status === 'paused' ? (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'active')}>
                                                        <Play className="mr-2 h-4 w-4" />
                                                        Ativar
                                                    </DropdownMenuItem>
                                                ) : null}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-semibold">{campaign.leads}</div>
                                            <div className="text-xs text-muted-foreground">Leads</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold">{campaign.views.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">Views</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold">{campaign.conversion}%</div>
                                            <div className="text-xs text-muted-foreground">Conversão</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Atualizada em</span>
                                            <span>{new Date(campaign.updatedAt).toLocaleDateString('pt-BR')}</span>
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
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Crie sua primeira campanha para começar a capturar leads'
                                }
                            </p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Campanha
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal para Nova Campanha */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nova Campanha</DialogTitle>
                        <DialogDescription>
                            Crie uma nova campanha de captação de leads preenchendo as informações abaixo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título da Campanha</Label>
                            <Input
                                id="title"
                                placeholder="Digite o título da campanha"
                                value={newCampaign.title}
                                onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL da Campanha</Label>
                            <Input
                                id="url"
                                placeholder="https://exemplo.com/campanha"
                                value={newCampaign.url}
                                onChange={(e) => setNewCampaign(prev => ({ ...prev, url: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleModalClose}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateCampaign}
                            disabled={!newCampaign.title.trim() || !newCampaign.url.trim()}
                        >
                            Criar Campanha
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Campaigns;