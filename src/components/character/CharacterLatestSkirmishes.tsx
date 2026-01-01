import { gql } from '@apollo/client';
import { useSearchParams } from 'react-router';
import { SkirmishList } from '@/components/skirmish/SkirmishList';
import {
  SkirmishFilters,
  getskirmishFilters,
} from '@/components/skirmish/SkirmishFilters';
import { ReactElement } from 'react';

const LATEST_SKIRMISHES = gql`
  query GetCharacterLatestSkirmishes(
    $characterId: ID
    $where: SkirmishFilterInput
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(
      characterId: $characterId
      where: $where
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        scenario {
          id
          name
          zone {
            id
            name
          }
        }
        start
        end
        result
        scoreboardEntries {
          nodes {
            rank
            kills
            deaths
            damageDone
            healingDone
            renown
          }
        }
      }
    }
  }
`;

interface CharacterLatestSkirmishesProps {
  characterId: string;
}

export function CharacterLatestSkirmishes({ characterId }: CharacterLatestSkirmishesProps): ReactElement {
  const [search] = useSearchParams();
  const filters = getskirmishFilters(search);

  return (
    <SkirmishList
      query={LATEST_SKIRMISHES}
      queryOptions={{
        variables: {
          characterId,
          where: getskirmishFilters(search),
          first: 10,
        },
      }}
      perPage={10}
      title="Latest Skirmishes"
      showZone={true}
    />
  );
}
