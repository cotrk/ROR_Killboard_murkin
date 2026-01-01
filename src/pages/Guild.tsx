import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { GuildRecentDeaths } from '@/components/guild/GuildRecentDeaths';
import { GuildRecentKills } from '@/components/guild/GuildRecentKills';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GuildMemberList } from '@/components/guild/GuildMemberList';
import { GUILD_INFO_FRAGMENT, GuildInfo } from '@/components/guild/GuildInfo';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { ScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { ScenarioCount } from '@/components/scenario/ScenarioCount';
import { GuildLatestSkirmishes } from '@/components/guild/GuildLatestSkirmishes';
import { ThemeController } from '@/components/ui/ThemeController';
import { ReactElement } from 'react';
import { GetGuildInfoQuery } from '@/__generated__/graphql';

const GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
      ...GuildInfo
      name
      description
      briefDescription
      level
      realm
      heraldry {
        emblem
        pattern
        color1
        color2
        shape
      }
      leader {
        id
        name
        career
      }
      members {
        totalCount
        nodes {
          rank {
            name
          }
          character {
            id
            name
            career
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
  }

  ${GUILD_INFO_FRAGMENT}
`;

export function Guild({
  tab,
}: {
  tab: 'kills' | 'members' | 'scenarios' | 'skirmishes';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<GetGuildInfoQuery>(GUILD_INFO, {
    variables: { id },
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guild == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:guildPage.guildId', { guildId: id })}
            </li>
          </ul>
        </nav>
        <ThemeController />
      </div>
      
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <GuildInfo guild={data.guild} />
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <Link 
          to={`/guild/${id}`} 
          className={`tab tab-lg ${tab === 'kills' ? 'tab-active' : ''}`}
        >
          {t('pages:guildPage.kills')}
        </Link>
        <Link 
          to={`/guild/${id}/members`}
          className={`tab tab-lg ${tab === 'members' ? 'tab-active' : ''}`}
        >
          {t('pages:guildPage.members')}
        </Link>
        <Link 
          to={`/guild/${id}/scenarios`}
          className={`tab tab-lg ${tab === 'scenarios' ? 'tab-active' : ''}`}
        >
          {t('pages:guildPage.scenarios')}
        </Link>
        <Link 
          to={`/guild/${id}/skirmishes`}
          className={`tab tab-lg ${tab === 'skirmishes' ? 'tab-active' : ''}`}
        >
          {t('pages:guildPage.skirmishes')}
        </Link>
      </div>

      {tab === 'kills' && (
        <>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <KillsFilters />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-primary mb-4">Recent Kills</h3>
                <GuildRecentKills id={Number(id)} />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary mb-4">Recent Deaths</h3>
                <GuildRecentDeaths id={Number(id)} />
              </div>
            </div>
          </div>
        </>
      )}
      {tab === 'members' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <GuildMemberList id={id} />
          </div>
        </div>
      )}
      {tab === 'scenarios' && (
        <>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <ScenarioFilters showPremadeOnly />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-success mb-4">Wins</h3>
                <ScenarioCount guildId={id} wins title="Wins" />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-error mb-4">Losses</h3>
                <ScenarioCount guildId={id} wins={false} title="Losses" />
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioList guildId={id} />
            </div>
          </div>
        </>
      )}
      {tab === 'skirmishes' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <GuildLatestSkirmishes guildId={id} />
          </div>
        </div>
      )}
    </div>
  );
}
