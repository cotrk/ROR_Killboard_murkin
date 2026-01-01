import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SkirmishList } from '@/components/skirmish/SkirmishList';
import { ReactElement } from 'react';

const LATEST_GUILD_SKIRMISHES = gql`
  query GetLatestGuildSkirmishes(
    $guildId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: SkirmishFilterInput
  ) {
    skirmishes(
      guildId: $guildId
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

interface GuildLatestSkirmishesProps {
  guildId: string;
}

export function GuildLatestSkirmishes({ guildId }: GuildLatestSkirmishesProps): ReactElement {
  const { t } = useTranslation(['common', 'guild']);

  return (
    <SkirmishList
      query={LATEST_GUILD_SKIRMISHES}
      queryOptions={{
        variables: {
          guildId: parseInt(guildId),
          first: 10,
        },
      }}
      perPage={10}
      title="Latest Skirmishes"
      showZone={true}
    />
  );
}
