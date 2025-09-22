import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LeadCardSkeleton: React.FC = () => {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Checkbox skeleton */}
            <Skeleton className="h-4 w-4 rounded" />
            <div className="min-w-0 flex-1">
              {/* Nome do lead */}
              <Skeleton className="h-5 w-3/4 mb-1" />
              {/* Email do lead */}
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          {/* Menu de ações */}
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>

        <div className="space-y-2">
          {/* Campanha */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Telefone (opcional) */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCardSkeleton;