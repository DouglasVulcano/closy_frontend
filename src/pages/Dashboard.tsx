import {
  BarChart3,
  Users,
  Megaphone,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Total de Leads',
    value: '1,234',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'Últimos 30 dias'
  },
  {
    title: 'Campanhas Ativas',
    value: '12',
    change: '+2',
    changeType: 'positive' as const,
    icon: Megaphone,
    description: 'Em execução'
  },
  {
    title: 'Taxa de Conversão',
    value: '3.2%',
    change: '-0.3%',
    changeType: 'negative' as const,
    icon: TrendingUp,
    description: 'Média mensal'
  },
  {
    title: 'Visualizações',
    value: '45.2k',
    change: '+18.7%',
    changeType: 'positive' as const,
    icon: Eye,
    description: 'Este mês'
  },
];

const recentCampaigns = [
  {
    id: '1',
    name: 'Campanha Black Friday 2024',
    status: 'active',
    leads: 234,
    conversion: 4.2,
    views: 5600,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Webinar Marketing Digital',
    status: 'active',
    leads: 156,
    conversion: 3.8,
    views: 4100,
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'E-book Gratuito',
    status: 'paused',
    leads: 89,
    conversion: 2.1,
    views: 4200,
    createdAt: '2024-01-10'
  },
];

const recentLeads = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    campaign: 'Black Friday 2024',
    createdAt: '2024-01-15T10:30:00Z',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@exemplo.com',
    campaign: 'Webinar Marketing',
    createdAt: '2024-01-15T09:15:00Z',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@exemplo.com',
    campaign: 'E-book Gratuito',
    createdAt: '2024-01-15T08:45:00Z',
    avatar: '/placeholder.svg'
  },
];

const Dashboard = () => {
  return (
    <div className="w-full max-w-full overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas campanhas e leads
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-lift w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-1 truncate">{stat.description}</span>
                  <div className={`flex items-center flex-shrink-0 ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Campaigns */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle>Campanhas Recentes</CardTitle>
                <CardDescription>
                  Suas campanhas mais recentes e seu desempenho
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link to="/campaigns">
                  Ver todas
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{campaign.name}</h4>
                      <Badge 
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs w-fit"
                      >
                        {campaign.status === 'active' ? 'Ativa' : 'Pausada'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span>{campaign.leads} leads</span>
                      <span>{campaign.conversion}% conversão</span>
                      <span>{campaign.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle>Leads Recentes</CardTitle>
                <CardDescription>
                  Últimos contatos capturados
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link to="/leads">
                  Ver todos
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.campaign}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0 text-right">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visão Geral de Performance</CardTitle>
          <CardDescription>
            Métricas principais das suas campanhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">Taxa de Conversão</span>
                <span className="font-medium flex-shrink-0">3.2%</span>
              </div>
              <Progress value={32} className="h-2" />
              <p className="text-xs text-muted-foreground">Meta: 5%</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">Engajamento</span>
                <span className="font-medium flex-shrink-0">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">Meta: 70%</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">Qualidade dos Leads</span>
                <span className="font-medium flex-shrink-0">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Meta: 80%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;