import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { getCurrentFilters } from '@/components/kill/KillsFilters';
import { KillsListTable } from '@/components/kill/KillsListTable';

export function KillsList({
  query,
  queryOptions,
  perPage,
  title = undefined,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions;
  perPage: number;
  title?: string | null;
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();
  const filters = getCurrentFilters(search);

  const { loading, error, data, fetchMore } = useQuery(query, {
    variables: {
      first: perPage,
      ...filters,
      ...queryOptions?.variables,
    },
    ...queryOptions,
  });

  if (loading) return <LoadingState message="Loading kills..." />;
  if (error) return <div className="alert alert-error">Error loading kills: {error.message}</div>;
  if (!data?.kills?.nodes.length) {
    return <div className="alert alert-info">No kills found</div>;
  }

  const kills = data.kills.nodes;
  const pageInfo = data.kills.pageInfo;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        
        <div className="overflow-x-auto">
          <KillsListTable 
            data={kills}
            showTime={showTime}
            showVictim={showVictim}
            showKiller={showKiller}
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-center gap-2">
            {pageInfo.hasPreviousPage && (
              <button className="btn btn-outline btn-sm">Previous</button>
            )}
            {pageInfo.hasNextPage && (
              <button className="btn btn-outline btn-sm">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
