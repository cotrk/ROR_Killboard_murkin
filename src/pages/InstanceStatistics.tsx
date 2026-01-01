import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { InstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { InstanceEncounterStatistics } from '@/components/instance_statistics/InstanceEncounterStatistics';
import { ReactElement } from 'react';

const INSTANCE_STATISTICS = gql`
  query GetInstanceStatistics($id: ID!) {
    instance(id: $id) {
      id
      name
      scenario {
        id
        name
      }
      encounters {
        nodes {
          id
          name
          statistics {
            totalRuns
            averageDuration
            successRate
            averageKills
            averageDeaths
          }
        }
      }
    }
  }
`;

export function InstanceStatistics(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(INSTANCE_STATISTICS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading instance statistics..." />;
  if (error) return <div className="alert alert-error">Error loading statistics: {error.message}</div>;
  if (!data?.instance) return <div className="alert alert-info">Instance not found</div>;

  const instance = data.instance;

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
              <Link to={`/instance/${instance.id}`} className="link-hover link-primary">
                {instance.name}
              </Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:instanceStatistics.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{instance.name} - Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="stat">
              <div className="stat-title">Instance</div>
              <div className="stat-value text-lg">{instance.name}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Scenario</div>
              <div className="stat-value text-lg">{instance.scenario?.name}</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title">Filters</h2>
              <InstanceEncounterRunsFilters />
            </div>
          </div>

          {instance.encounters && instance.encounters.nodes.length > 0 && (
            <>
              <h2 className="card-title mb-4">Encounter Statistics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {instance.encounters.nodes.map((encounter: any) => (
                  <div key={encounter.id} className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{encounter.name}</h3>
                      
                      {encounter.statistics && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="stat">
                            <div className="stat-title text-xs">Total Runs</div>
                            <div className="stat-value text-lg">{encounter.statistics.totalRuns}</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title text-xs">Success Rate</div>
                            <div className="stat-value text-lg">{encounter.statistics.successRate}%</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title text-xs">Avg Duration</div>
                            <div className="stat-value text-lg">{encounter.statistics.averageDuration}s</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title text-xs">Avg K/D</div>
                            <div className="stat-value text-lg">
                              {encounter.statistics.averageKills}/{encounter.statistics.averageDeaths}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <InstanceEncounterStatistics 
  name={encounter.name}
  instanceId={instance.id}
  encounterId={encounter.id}
/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
