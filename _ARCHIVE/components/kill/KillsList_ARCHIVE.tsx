import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getCurrentFilters } from '@/components/kill/KillsFilters';
import { KillsListTable } from '@/components/kill/KillsListTable';
import { QueryPagination } from '@/components/global/QueryPagination';

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

  const { loading, error, data, refetch } = useQuery<Query>(query, {
    ...queryOptions,
    variables: {
      ...queryOptions?.variables,
      first: perPage,
      ...getCurrentFilters(search),
    },
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const kills = data?.kills;

  if (kills?.nodes == null) return <p className="text-center py-4">{t('common:error')}</p>;

  if (kills.nodes.length === 0) return null;

  const { pageInfo } = kills;

  return (
    <div>
      {title && (
        <h3 className="text-lg font-bold uppercase mb-4">
          {title} {kills.totalCount != null && kills.totalCount}
        </h3>
      )}
      <KillsListTable
        data={kills.nodes}
        showTime={showTime}
        showKiller={showKiller}
        showVictim={showVictim}
      />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
