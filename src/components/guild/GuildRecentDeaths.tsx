import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_GUILD_DEATHS = gql`
  query GetLatestGuildDeaths(
    $guildId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
  ) {
    kills(
      where: { victimGuildId: { eq: $guildId }, time: $time }
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

interface GuildRecentDeathsProps {
  guildId: string;
}

export function GuildRecentDeaths({ guildId }: GuildRecentDeathsProps): ReactElement {
  const { t } = useTranslation(['common', 'guild']);

  return (
    <KillsList
      query={RECENT_GUILD_DEATHS}
      queryOptions={{
        variables: {
          guildId: parseInt(guildId),
          first: 10,
        },
      }}
      perPage={10}
      title="Recent Deaths"
      showTime={true}
      showVictim={true}
      showKiller={true}
    />
  );
}
