import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LatestKills } from '@/components/kill/LatestKills';
import { WeeklyLeaderboard } from '@/components/kill/WeeklyLeaderboard';
import { SearchWithSuggestions } from '@/components/global/SearchWithSuggestions';
import { MonthlyLeaderboard } from '@/components/kill/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '@/components/kill/MonthlyLeaderboard.Guild';
import { WeeklyLeaderboardGuild } from '@/components/kill/WeeklyLeaderboardGuild';
import { ScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { LatestSkirmishes } from '@/components/skirmish/LatestSkirmishes';
import { TopSkirmishes } from '@/components/skirmish/TopSkirmishes';
import { LiveFeed } from '@/components/live/LiveFeed';
import { ThemeController } from '@/components/ui/ThemeController';
import { ReactElement } from 'react';

export function Home({
  tab,
}: {
  tab: 'players' | 'guilds' | 'scenarios' | 'skirmishes';
}): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto mt-2">
      <div className="flex justify-between items-center mb-4">
        <div className="tabs tabs-boxed">
          <Link 
            to="/" 
            className={`tab tab-lg ${tab === 'players' ? 'tab-active' : ''}`}
          >
            {t('pages:home.showPlayerLeaderboard')}
          </Link>
          <Link 
            to="/guilds" 
            className={`tab tab-lg ${tab === 'guilds' ? 'tab-active' : ''}`}
          >
            {t('pages:home.showGuildLeaderboard')}
          </Link>
          <Link 
            to="/scenarios" 
            className={`tab tab-lg ${tab === 'scenarios' ? 'tab-active' : ''}`}
          >
            {t('pages:home.showScenarios')}
          </Link>
          <Link 
            to="/skirmishes" 
            className={`tab tab-lg ${tab === 'skirmishes' ? 'tab-active' : ''}`}
          >
            {t('pages:home.showSkirmishes')}
          </Link>
        </div>
        <ThemeController />
      </div>
      {tab === 'scenarios' && (
        <>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioFilters />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioList perPage={10} />
            </div>
          </div>
        </>
      )}
      {tab === 'players' && (
        <>
          <SearchWithSuggestions isPlayer />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <MonthlyLeaderboard />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <WeeklyLeaderboard />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <LatestKills />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <LiveFeed maxItems={5} />
              </div>
            </div>
          </div>
        </>
      )}
      {tab === 'guilds' && (
        <>
          <SearchWithSuggestions isPlayer={false} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <MonthlyGuildLeaderboard />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <WeeklyLeaderboardGuild />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <LatestKills />
            </div>
          </div>
        </>
      )}
      {tab === 'skirmishes' && (
        <>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <TopSkirmishes />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <LatestSkirmishes />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
