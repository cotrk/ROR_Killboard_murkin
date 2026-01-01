import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { ScenarioKills } from '@/components/scenario/ScenarioKills';
import { ScenarioScoreboard } from '@/components/scenario/ScenarioScoreboard';
import { ScenarioHeatmap } from '@/components/scenario/ScenarioHeatmap';
import { ScenarioCount } from '@/components/scenario/ScenarioCount';
import { ReactElement } from 'react';
import { GetScenarioInfoQuery } from '@/__generated__/graphql';

const SCENARIO_INFO = gql`
  query GetScenarioInfo($id: ID!) {
    scenario(id: $id) {
      id
    }
  }
`;

export function Scenario({
  tab = 'scoreboard'
}: {
  tab: 'scoreboard' | 'kills' | 'skirmishes' | 'map';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'scenarios']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetScenarioInfoQuery>(SCENARIO_INFO, {
    variables: { id },
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading scenario: {error.message}</div>;
  if (!data?.scenario) return <div className="alert alert-info">Scenario not found</div>;

  const scenario = data.scenario;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/scenarios" className="link-hover link-primary">{t('common:scenarios')}</Link>
            </li>
            <li className="text-base-content/60">
              Scenario {id}
            </li>
          </ul>
        </nav>
      </div>

      {/* Scenario Info Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Scenario Details</h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <Link 
          to={`/scenario/${id}`}
          className={`tab tab-lg ${tab === 'scoreboard' ? 'tab-active' : ''}`}
        >
          {t('scenarios:scoreboard')}
        </Link>
        <Link 
          to={`/scenario/${id}/kills`}
          className={`tab tab-lg ${tab === 'kills' ? 'tab-active' : ''}`}
        >
          {t('scenarios:kills')}
        </Link>
        <Link 
          to={`/scenario/${id}/skirmishes`}
          className={`tab tab-lg ${tab === 'skirmishes' ? 'tab-active' : ''}`}
        >
          {t('scenarios:skirmishes')}
        </Link>
        <Link 
          to={`/scenario/${id}/map`}
          className={`tab tab-lg ${tab === 'map' ? 'tab-active' : ''}`}
        >
          {t('scenarios:map')}
        </Link>
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {tab === 'scoreboard' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('scenarios:scoreboard')}</h3>
              <ScenarioScoreboard entries={[]} />
            </div>
          )}

          {tab === 'kills' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('scenarios:kills')}</h3>
              <ScenarioKills scenarioId={id || ''} />
            </div>
          )}

          {tab === 'skirmishes' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('scenarios:skirmishes')}</h3>
              <div className="alert alert-info">
                Skirmish data coming soon...
              </div>
            </div>
          )}

          {tab === 'map' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('scenarios:map')}</h3>
              <ScenarioHeatmap zoneId="" id={id || ''} />
            </div>
          )}
        </div>
      </div>

      {/* Scenario Statistics */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h3 className="text-lg font-bold mb-4">{t('scenarios:statistics')}</h3>
          <ScenarioCount characterId="" guildId="" />
        </div>
      </div>
    </div>
  );
}
