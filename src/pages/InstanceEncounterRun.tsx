import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { intervalToDuration, formatDuration, format } from 'date-fns';
import { Link, useParams } from 'react-router';
import { ReactElement } from 'react';
import { GetInstanceEncounterRunQuery } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';

const INSTANCE_ENCOUNTER_RUN = gql`
  query GetInstanceEncounterRun($id: ID!) {
    instanceEncounterRun(id: $id) {
      id
      start
      end
      scoreboardEntries {
        character {
          id
          name
          career
        }
        guild {
          id
          name
        }
        damage
        killDamage
        deaths
        renownRank
        level
      }
      encounter {
        id
        name
      }
    }
  }
`;

export function InstanceEncounterRun(): ReactElement {
  const { instanceRunId, id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<GetInstanceEncounterRunQuery>(
    INSTANCE_ENCOUNTER_RUN,
    {
      variables: {
        id,
      },
    },
  );

  if (loading || !data?.instanceEncounterRun)
    return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading instance run: {error.message}
      </div>
    );

  const run = data.instanceEncounterRun;
  const duration =
    run.end && run.start
      ? intervalToDuration({
          start: new Date(run.start),
          end: new Date(run.end),
        })
      : null;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">
                {t('common:home')}
              </Link>
            </li>
            <li>
              <Link to="/instance-runs" className="link-hover link-primary">
                {t('common:instanceRuns')}
              </Link>
            </li>
            <li className="text-base-content/60">
              {run.encounter?.name || 'Instance Run'}
            </li>
          </ul>
        </nav>
      </div>

      {/* Instance Run Info Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            {run.encounter?.name || 'Instance Run'} Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat">
              <div className="stat-title">Start Time</div>
              <div className="stat-value text-sm">
                {run.start
                  ? format(new Date(run.start), 'MMM dd, yyyy HH:mm')
                  : 'Unknown'}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">End Time</div>
              <div className="stat-value text-sm">
                {run.end
                  ? format(new Date(run.end), 'MMM dd, yyyy HH:mm')
                  : 'Unknown'}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-sm">
                {duration ? formatDuration(duration) : 'Unknown'}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Status</div>
              <div className="stat-value text-sm">
                {run.end ? (
                  <span className="text-success">Completed</span>
                ) : (
                  <span className="text-warning">In Progress</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="text-lg font-bold mb-4">Scoreboard</h3>

          {run.scoreboardEntries && run.scoreboardEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Character</th>
                    <th>Guild</th>
                    <th>Damage</th>
                    <th>Kill Damage</th>
                    <th>Deaths</th>
                    <th>Renown Rank</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {run.scoreboardEntries
                    .sort((a, b) => b.damage - a.damage)
                    .map((entry, index) => (
                      <tr key={entry.character.id}>
                        <td>
                          <div className="badge badge-primary">
                            #{index + 1}
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/character/${entry.character.id}`}
                            className="link-hover link-primary font-medium"
                          >
                            {entry.character.name}
                          </Link>
                          <div className="text-sm text-base-content/80">
                            {entry.character.career}
                          </div>
                        </td>
                        <td>
                          {entry.guild && (
                            <Link
                              to={`/guild/${entry.guild.id}`}
                              className="link-hover link-primary text-sm"
                            >
                              {entry.guild.name}
                            </Link>
                          )}
                        </td>
                        <td>
                          <div className="text-sm font-mono">
                            {entry.damage?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-mono">
                            {entry.killDamage?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-mono">
                            {entry.deaths?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-mono text-success">
                            {entry.renownRank?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-mono text-primary">
                            {entry.level?.toLocaleString() || '0'}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No scoreboard data available for this instance run.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex gap-4">
            <Link
              to={`/instance/${run.encounter?.id}`}
              className="btn btn-outline"
            >
              View Instance Details
            </Link>

            {instanceRunId && (
              <Link to={`/instance-runs`} className="btn btn-primary">
                Back to Instance Runs
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
