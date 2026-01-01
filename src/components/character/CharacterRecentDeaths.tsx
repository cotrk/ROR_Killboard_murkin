import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths(
    $id: UnsignedInt!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { victimCharacterId: { eq: $id }, time: $time }
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

interface CharacterRecentDeathsProps {
  characterId: string;
}

export function CharacterRecentDeaths({ characterId }: CharacterRecentDeathsProps): ReactElement {
  const { t } = useTranslation(['common', 'character']);

  return (
    <KillsList
      query={RECENT_DEATHS}
      queryOptions={{
        variables: {
          id: parseInt(characterId),
          first: 10,
        },
      }}
      perPage={10}
      title="Recent Deaths"
      showTime={true}
      showVictim={false}
      showKiller={true}
    />
  );
}
