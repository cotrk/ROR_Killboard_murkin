import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_KILLS = gql`
  query GetLatestCharacterKills(
    $id: UnsignedInt!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { attackers: { some: { characterId: { eq: $id } } }, time: $time }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        time
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

interface CharacterRecentKillsProps {
  characterId: string;
}

export function CharacterRecentKills({ characterId }: CharacterRecentKillsProps): ReactElement {
  const { t } = useTranslation(['common', 'character']);

  return (
    <KillsList
      query={RECENT_KILLS}
      queryOptions={{
        variables: {
          id: parseInt(characterId),
          first: 10,
        },
      }}
      perPage={10}
      title="Recent Kills"
      showTime={true}
      showVictim={true}
      showKiller={false}
    />
  );
}
