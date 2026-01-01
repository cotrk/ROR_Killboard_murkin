import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const SKIRMISH_KILLS = gql`
  query GetSkirmishKills(
    $skirmishId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
  ) {
    kills(
      where: { skirmishId: { eq: $skirmishId }, time: $time }
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
        scenario {
          id
          name
        }
      }
    }
  }
`;

interface SkirmishKillsProps {
  skirmishId: string;
}

export function SkirmishKills({ skirmishId }: SkirmishKillsProps): ReactElement {
  const { t } = useTranslation(['common', 'skirmish']);

  return (
    <KillsList
      query={SKIRMISH_KILLS}
      queryOptions={{
        variables: {
          skirmishId: parseInt(skirmishId),
          first: 10,
        },
      }}
      perPage={10}
      title="Skirmish Kills"
      showTime={true}
      showVictim={true}
      showKiller={true}
    />
  );
}
