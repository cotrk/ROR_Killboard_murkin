import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const SCENARIO_KILLS = gql`
  query GetScenarioKills(
    $scenarioId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
  ) {
    kills(
      where: { scenarioId: { eq: $scenarioId }, time: $time }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        time
        attackers {
          character {
            id
            name
            career
            level
            guild {
              id
              name
            }
          }
          damagePercent
        }
        victim {
          character {
            id
            name
            career
            level
            guild {
              id
              name
            }
          }
          damagePercent
        }
        position {
          zone {
            id
            name
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    startCursor
    }
  }
`;

interface ScenarioKillsProps {
  scenarioId: string;
}

export function ScenarioKills({ scenarioId }: ScenarioKillsProps): ReactElement {
  const { t } = useTranslation(['common', 'scenarios']);

  return (
    <KillsList
      query={SCENARIO_KILLS}
      queryOptions={{
        variables: {
          scenarioId,
          first: 10,
        },
      }}
      perPage={10}
      title="Scenario Kills"
      showTime={true}
      showVictim={true}
      showKiller={true}
    />
  );
}
