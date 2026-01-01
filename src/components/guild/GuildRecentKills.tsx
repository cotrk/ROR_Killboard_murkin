import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_GUILD_KILLS = gql`
  query GetLatestGuildKills(
    $guildId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
  ) {
    kills(
      where: { attackers: { some: { guildId: { eq: $guildId } } }, time: $time }
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

interface GuildRecentKillsProps {
  guildId: string;
}

export function GuildRecentKills({ guildId }: GuildRecentKillsProps): ReactElement {
  const { t } = useTranslation(['common', 'guild']);

  return (
    <KillsList
      query={RECENT_GUILD_KILLS}
      queryOptions={{
        variables: {
          guildId: parseInt(guildId),
          first: 10,
        },
      }}
      perPage={10}
      title="Recent Kills"
      showTime={true}
      showVictim={true}
      showKiller={true}
    />
  );
}
