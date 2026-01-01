import { gql, useQuery } from '@apollo/client';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import _ from 'lodash';
import { LoadingState } from '@/components/shared/LoadingState';
import { Realm } from '@/__generated__/graphql';
import { SkirmishScoreboard } from '@/components/skirmish/SkirmishScoreboard';
import { SkirmishTopPlayer } from '@/components/skirmish/SkirmishTopPlayer';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import { SkirmishKills } from '@/components/skirmish/SkirmishKills';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { SkirmishDamage } from '@/components/skirmish/SkirmishDamage';
import { SkirmishDamageByCharacter } from '@/components/skirmish/SkirmishDamageByCharacter';
import { ReactElement } from 'react';
import { GetSkirmishInfoQuery } from '@/__generated__/graphql';

const SKIRMISH_INFO = gql`
  query GetSkirmishInfo($id: ID!) {
    skirmish(id: $id) {
      id
      startTime
      endTime
      numberOfKills
      numberOfKillsOrder
      numberOfKillsDestruction
      numberOfPlayers
      numberOfPlayersOrder
      numberOfPlayersDestruction
      instance {
        id
        scenario {
          id
          name
        }
      }
      primaryZone {
        id
        name
      }
      topGuildsByPlayers {
        guild {
          id
          name
          realm
          heraldry
        }
        count
      }
      topGuildsByKills {
        guild {
          id
          name
          realm
          heraldry
        }
        count
      }
      heatmap {
        x
        y
        count
      }
    }
  }
`;

export function Skirmish(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();
  
  const { loading, error, data } = useQuery<GetSkirmishInfoQuery>(SKIRMISH_INFO, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading skirmish data..." />;
  if (error) return <div className="alert alert-error">Error loading skirmish: {error.message}</div>;
  if (data?.skirmish == null) return <div className="alert alert-info">Skirmish not found</div>;

  const skirmish = data.skirmish;
  const startDate = new Date(skirmish.startTime * 1000);
  const endDate = new Date(skirmish.endTime * 1000);
  const durationObject = intervalToDuration({
    start: startDate,
    end: endDate,
  });
  
  if (durationObject.days || durationObject.hours || durationObject.minutes) {
    durationObject.seconds = undefined;
  }
  const duration = formatDuration(durationObject);

  const mapSize = 300;
  const heatmapData = skirmish.heatmap.map(
    (point): [number, number, number] => [
      point.x * (mapSize / 64) + mapSize / 64 / 2,
      point.y * (mapSize / 64) + mapSize / 64 / 2,
      point.count,
    ],
  );

  const max: number = (_.maxBy(heatmapData, (d) => d[2]) || [0, 0, 1])[2];

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/skirmishes" className="link-hover link-primary">{t('common:skirmishes')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:skirmishPage.skirmishId', { skirmishId: id })}
            </li>
          </ul>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {skirmish.instance == null ? (
                skirmish.primaryZone?.name
              ) : (
                <Link to={`/scenario/${skirmish.instance.id}`} className="link-hover link-primary">
                  {skirmish.instance.scenario.name}
                </Link>
              )}
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{t('pages:skirmishPage.startTime')}</span>
                <span>
                  {formatISO(startDate, { representation: 'date' })}{' '}
                  {format(startDate, 'HH:mm')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('pages:skirmishPage.duration')}</span>
                <span>{duration}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('pages:skirmishPage.totalPlayers')}</span>
                <span>
                  {skirmish.numberOfPlayers}
                  <span className="text-base-content/60 ml-2">
                    (
                    <span className="text-info">{skirmish.numberOfPlayersOrder}</span>
                    {' / '}
                    <span className="text-error">{skirmish.numberOfPlayersDestruction}</span>
                    )
                  </span>
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('pages:skirmishPage.totalKills')}</span>
                <span>
                  {skirmish.numberOfKills}
                  <span className="text-base-content/60 ml-2">
                    (
                    <span className="text-info">{skirmish.numberOfKillsOrder}</span>
                    {' / '}
                    <span className="text-error">{skirmish.numberOfKillsDestruction}</span>
                    )
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Top Guilds by Players</h2>
            <div className="space-y-2">
              {skirmish.topGuildsByPlayers.map((topGuild) => (
                <div key={topGuild.guild.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GuildHeraldry
                      size="24"
                      heraldry={topGuild.guild.heraldry}
                      realm={topGuild.guild.realm}
                    />
                    <Link to={`/guild/${topGuild.guild.id}`} className="link-hover link-primary">
                      {topGuild.guild.name}
                    </Link>
                  </div>
                  <div className={
                    topGuild.guild.realm === Realm.Destruction
                      ? 'text-error'
                      : 'text-info'
                  }>
                    {topGuild.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Zone Heatmap</h2>
          <ZoneHeatmap 
            zoneId={skirmish.primaryZone?.id || skirmish.instance?.id || ''}
            max={max}
            data={heatmapData}
            size={mapSize}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Scoreboard</h2>
            <SkirmishScoreboard id={skirmish.id} attribute="kills" title="Kills" className="text-primary" />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Top Players</h2>
            <SkirmishTopPlayer id={skirmish.id} attribute="kills" title="Most Kills" className="text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Damage Analysis</h2>
            <SkirmishDamage id={skirmish.id} />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Damage by Character</h2>
            <SkirmishDamageByCharacter id={skirmish.id} />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Kill Details</h2>
          <SkirmishKills id={skirmish.id} />
        </div>
      </div>
    </div>
  );
}
