import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const LATEST_KILLS = gql`
  query GetLatestKills(
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(first: $first, last: $last, before: $before, after: $after) {
      nodes {
        id
        time
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
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        attackers {
          level
          renownRank
          damagePercent
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export function LatestKills(): ReactElement {
  const { t } = useTranslation('components');

  return (
    <div>
      <h3 className="text-lg font-bold uppercase mb-4">
        {t('latestKills.title')}
      </h3>
      <KillsList query={LATEST_KILLS} perPage={10} />
    </div>
  );
}
