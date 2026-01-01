import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { getCurrentFilters } from '@/components/kill/KillsFilters';
import { SkirmishListTable } from '@/components/skirmish/SkirmishListTable';

export function SkirmishList({
  query,
  queryOptions,
  perPage,
  title = undefined,
  showZone = true,
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions;
  perPage: number;
  title?: string | null;
  showZone?: boolean;
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();

  const { loading, error, data } = useQuery<Query>(query, {
    ...queryOptions,
    variables: {
      ...queryOptions?.variables,
      first: perPage,
      ...getCurrentFilters(search),
    },
  });

  if (loading) return <LoadingState message="Loading skirmishes..." />;
  if (error) return <div className="alert alert-error">Error loading skirmishes: {error.message}</div>;
  if (!data?.skirmishes?.nodes || !data.skirmishes.nodes.length) {
    return <div className="alert alert-info">No skirmishes found</div>;
  }

  const skirmishes = data?.skirmishes?.nodes || [];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        
        <div className="overflow-x-auto">
          <SkirmishListTable 
            data={skirmishes}
            showZone={showZone}
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-center gap-2">
            <button className="btn btn-outline btn-sm">Previous</button>
            <button className="btn btn-outline btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
