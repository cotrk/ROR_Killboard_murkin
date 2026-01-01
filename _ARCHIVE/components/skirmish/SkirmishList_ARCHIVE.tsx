import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getCurrentFilters } from '@/components/kill/KillsFilters';
import { SkirmishListTable } from '@/components/skirmish/SkirmishListTable';
import { QueryPagination } from '@/components/global/QueryPagination';

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

  const { loading, error, data, refetch } = useQuery<Query>(query, {
    ...queryOptions,
    variables: {
      ...queryOptions?.variables,
      first: perPage,
      ...getCurrentFilters(search),
    },
  });

  if (loading) return <div className="flex justify-center py-4"><span className="loading loading-spinner loading-md"></span></div>;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const skirmishes = data?.skirmishes;

  if (skirmishes?.nodes == null) return <p className="text-center py-4">{t('common:error')}</p>;

  if (skirmishes.nodes.length === 0) return null;

  const { pageInfo } = skirmishes;

  return (
    <div>
      {title && (
        <h3 className="text-lg font-bold uppercase mb-4">
          {title} {skirmishes.totalCount != null && skirmishes.totalCount}
        </h3>
      )}
      <SkirmishListTable data={skirmishes.nodes} showZone={showZone} />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
