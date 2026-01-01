import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useParams } from 'react-router';
import { LoadingState } from '@/components/shared/LoadingState';
import { Archetype } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  INSTANCE_RUN_SCOREBOARD_FRAGMENT,
  InstanceRunScoreboard,
} from '@/components/instance_run/InstanceRunScoreboard';
import { ReactElement } from 'react';

const INSTANCE_RUN = gql`
  query InstanceRun($id: ID!) {
    instanceRun(id: $id) {
      id
      start
      end
      instance {
        id
        name
      }
      scoreboardEntries {
        nodes {
          id
          character {
            id
            name
            career
            level
            renownRank
            guild {
              id
              name
              heraldry
            }
          }
          archetype
          kills
          deaths
          soloKills
          killingBlows
          damageDone
          damageTaken
          healingDone
          healingTaken
          experience
          renown
        }
      }
    }
  }
  ${INSTANCE_RUN_SCOREBOARD_FRAGMENT}
`;

export function InstanceRun(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const { loading, error, data } = useQuery(INSTANCE_RUN, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading instance run..." />;
  if (error) return <div className="alert alert-error">Error loading instance run: {error.message}</div>;
  if (!data?.instanceRun) return <div className="alert alert-info">Instance run not found</div>;

  const instanceRun = data.instanceRun;
  const startDate = new Date(instanceRun.start * 1000);
  const endDate = new Date(instanceRun.end * 1000);
  const duration = intervalToDuration({ start: startDate, end: endDate });

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/instances" className="link-hover link-primary">{t('pages:instances.title')}</Link>
            </li>
            <li>
              <Link to={`/instance/${instanceRun.instance.id}`} className="link-hover link-primary">
                {instanceRun.instance.name}
              </Link>
            </li>
            <li className="text-base-content/60">
              Run #{instanceRun.id}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{instanceRun.instance.name} - Run Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat">
              <div className="stat-title">Start Time</div>
              <div className="stat-value text-sm">
                {formatISO(startDate, { representation: 'date' })}{' '}
                {format(startDate, 'HH:mm')}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-lg">
                {formatDuration(duration, { format: ['minutes', 'seconds'] })}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Participants</div>
              <div className="stat-value text-lg">
                {instanceRun.scoreboardEntries?.nodes?.length || 0}
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Scoreboard</h2>
              <InstanceRunScoreboard 
                entries={instanceRun.scoreboardEntries?.nodes || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
