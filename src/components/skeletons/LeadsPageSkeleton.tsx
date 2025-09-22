import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadCardSkeleton } from './LeadCardSkeleton';

export const LeadsPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação mobile */}
      <div className="md:hidden flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>

      {/* Tabela desktop */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header da tabela */}
                <div className="border-b border-border p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                
                {/* Linhas da tabela */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="border-b border-border p-4">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <LeadCardSkeleton key={index} />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default LeadsPageSkeleton;