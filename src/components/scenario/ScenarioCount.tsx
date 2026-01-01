import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { LoadingStateInline } from '@/components/shared/LoadingState';
import { getScenarioFilters } from '@/components/scenario/ScenarioFilters';

const SCENARIO_COUNT = gql`
  query GetScenarioCount(
    $characterId: ID
    $guildId: ID
    $queueType: ScenarioQueueType
    $premadeOnly: Boolean
    $wins: Boolean
  ) {
    scenarios(
      characterId: $characterId
      guildId: $guildId
      queueType: $queueType
      premadeOnly: $premadeOnly
      wins: $wins
    ) {
      totalCount
    }
  }
`;

export function ScenarioCount({
  characterId,
  guildId,
}: {
  characterId?: string;
  guildId?: string;
}) {
  const { t } = useTranslation(['common', 'scenarios']);
  const [search] = useSearchParams();

  const { loading, error, data } = useQuery<Query>(SCENARIO_COUNT, {
    variables: {
      ...getScenarioFilters(search),
      characterId: characterId || null,
      guildId: guildId || null,
    },
  });

  const count = data?.scenarios?.totalCount || 0;

  if (loading)
    return (
      <div className="flex justify-center py-2">
        <LoadingStateInline size="sm" />
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        Error loading scenario count: {error.message}
      </div>
    );

  return (
    <div className="stat bg-base-100 shadow-xl">
      <div className="stat-body text-center">
        <div className="stat-value text-3xl font-bold">
          {count.toLocaleString()}
        </div>
        <div className="stat-title">{t('scenarios:totalScenarios')}</div>
      </div>
    </div>
  );
}
