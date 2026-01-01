import { gql, useQuery } from '@apollo/client';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { LoadingState } from '@/components/shared/LoadingState';
import { useEntityQuery } from '@/components/shared/useDataQuery';
import { useDataQueryHandler } from '@/components/shared/ErrorBoundary';
import { ScenarioKills } from '@/components/scenario/ScenarioKills';
import { ScenarioScoreboard } from '@/components/scenario/ScenarioScoreboard';
import { ScenarioHeatmap } from '@/components/scenario/ScenarioHeatmap';
import { ScenarioSkirmishes } from '@/components/scenario/ScenarioSkirmishes';
import { ReactElement } from 'react';
import { GetScenarioInfoQuery } from '@/__generated__/graphql';

export const SCENARIO_SCOREBOARD_FRAGMENT = gql`
  fragment ScenarioScoreboardEntry on ScenarioScoreboardEntry {
    character {
      id
      name
      career
    }
    guild {
      id
      name
      realm
      heraldry {
        emblem
        pattern
        color1
        color2
        shape
      }
    }
    count
    numberOfKills
    numberOfKillsOrder
    numberOfKillsDestruction
    numberOfPlayers
    numberOfPlayersOrder
    numberOfPlayersDestruction
  }
`;

const SCENARIO_INFO = gql`
  query GetScenarioInfo($id: ID!) {
    scenario(id: $id) {
      id
      scenario {
        id
        name
        zone {
          id
          name
        }
      }
      startTime
      endTime
      queueType
      points
      scoreboardEntries {
        ...ScenarioScoreboardEntry
      }
    }
  }

  ${SCENARIO_SCOREBOARD_FRAGMENT}
`;

const ScenarioQueueTypes: Record<number, string> = {
  0: 'Standard',
  1: 'Group Ranked',
  2: 'Discordant Skirmish',
  3: 'Unused',
  4: 'City Siege',
  5: 'Solo Ranked',
  6: 'Group Challenge',
};

export function Scenario({
  tab,
}: {
  tab: 'scoreboard' | 'kills' | 'skirmishes' | 'map';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useEntityQuery(SCENARIO_INFO, { id });
  const { handleLoadingError } = useDataQueryHandler();
  const errorElement = handleLoadingError(loading, error, data?.scenario);
  if (errorElement) return errorElement;

  const { scenario } = data;
  const startDate = new Date(scenario.startTime * 1000);
  const endDate = new Date(scenario.endTime * 1000);
  const duration = formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate,
    }),
  );

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:scenarioPage.scenarioId', { scenarioId: id })}
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-4">{scenario.scenario.name}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Date:</span>
                  <span className="text-base-content/60">{formatISO(startDate, { representation: 'date' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Time:</span>
                  <span className="text-base-content/60">{format(startDate, 'HH:mm:ss')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Duration:</span>
                  <span className="text-base-content/60">{duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Type:</span>
                  <span className="badge badge-ghost">{ScenarioQueueTypes[scenario.queueType]}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <img
                    src="/images/icons/scenario/order.png"
                    width={55}
                    height={55}
                    alt={t('pages:scenarioPage.order') ?? ''}
                  />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {scenario.points?.[0]}
                </div>
                <div className="text-sm text-base-content/60">
                  {t('pages:scenarioPage.order')}
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 mt-4">
                <div className="text-center">
                  <img
                    src="/images/icons/scenario/destruction.png"
                    width={55}
                    height={55}
                    alt={t('pages:scenarioPage.destruction') ?? ''}
                  />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {scenario.points?.[1]}
                </div>
                <div className="text-sm text-base-content/60">
                  {t('pages:scenarioPage.destruction')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tabs tabs-boxed">
        <a 
          className={`tab ${tab === 'scoreboard' ? 'tab-active' : ''}`}
          href={`/scenario/${id}`}
        >
          {t('pages:scenarioPage.scoreboard')}
        </a>
        <a 
          className={`tab ${tab === 'kills' ? 'tab-active' : ''}`}
          href={`/scenario/${id}/kills`}
        >
          {t('pages:scenarioPage.kills')}
        </a>
        <a 
          className={`tab ${tab === 'skirmishes' ? 'tab-active' : ''}`}
          href={`/scenario/${id}/skirmishes`}
        >
          {t('pages:scenarioPage.skirmishes')}
        </a>
        <a 
          className={`tab ${tab === 'map' ? 'tab-active' : ''}`}
          href={`/scenario/${id}/map`}
        >
          {t('pages:scenarioPage.map')}
        </a>
      </div>
      
      <div className="mt-6">
        {tab === 'scoreboard' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioScoreboard entries={scenario.scoreboardEntries} />
            </div>
          </div>
        )}
        {tab === 'kills' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioKills id={id || ''} />
            </div>
          </div>
        )}
        {tab === 'skirmishes' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioSkirmishes id={id || ''} />
            </div>
          </div>
        )}
        {tab === 'map' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioHeatmap zoneId={scenario.scenario.zone.id} id={id || ''} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
