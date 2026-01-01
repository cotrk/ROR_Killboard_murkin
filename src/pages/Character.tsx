import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CharacterInfo } from '@/components/character/CharacterInfo';
import { CharacterRecentDeaths } from '@/components/character/CharacterRecentDeaths';
import { CharacterRecentKills } from '@/components/character/CharacterRecentKills';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { ScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { CharacterArmory } from '@/components/character/CharacterArmory';
import { ScenarioCount } from '@/components/scenario/ScenarioCount';
import { CharacterLatestSkirmishes } from '@/components/character/CharacterLatestSkirmishes';
import { KillChart } from '@/components/charts/KillChart';
import { ThemeController } from '@/components/ui/ThemeController';
import { ReactElement } from 'react';

export function Character({
  tab,
}: {
  tab: 'kills' | 'scenarios' | 'skirmishes' | 'armory';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:characterPage.characterId', { characterId: id })}
            </li>
          </ul>
        </nav>
        <ThemeController />
      </div>
      
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <CharacterInfo id={Number(id) || 0} />
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <Link 
          to={`/character/${id}`} 
          className={`tab tab-lg ${tab === 'kills' ? 'tab-active' : ''}`}
        >
          {t('pages:characterPage.kills')}
        </Link>
        <Link 
          to={`/character/${id}/scenarios`}
          className={`tab tab-lg ${tab === 'scenarios' ? 'tab-active' : ''}`}
        >
          {t('pages:characterPage.scenarios')}
        </Link>
        <Link 
          to={`/character/${id}/skirmishes`}
          className={`tab tab-lg ${tab === 'skirmishes' ? 'tab-active' : ''}`}
        >
          {t('pages:characterPage.skirmishes')}
        </Link>
        <Link 
          to={`/character/${id}/armory`}
          className={`tab tab-lg ${tab === 'armory' ? 'tab-active' : ''}`}
        >
          {t('pages:characterPage.armory')}
        </Link>
      </div>

      {tab === 'kills' && (
        <>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <KillsFilters />
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <KillChart 
                characterId={id}
                title="Recent Kill Activity"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-primary mb-4">Recent Kills</h3>
                <CharacterRecentKills id={Number(id)} />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary mb-4">Recent Deaths</h3>
                <CharacterRecentDeaths id={Number(id)} />
              </div>
            </div>
          </div>
        </>
      )}
      {tab === 'scenarios' && (
        <div>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <ScenarioFilters />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-success mb-4">Wins</h3>
                <ScenarioCount characterId={id} wins title="Wins" />
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-error mb-4">Losses</h3>
                <ScenarioCount characterId={id} wins={false} title="Losses" />
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <ScenarioList characterId={id} />
            </div>
          </div>
        </div>
      )}
      {tab === 'skirmishes' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <CharacterLatestSkirmishes characterId={id} />
          </div>
        </div>
      )}
      {tab === 'armory' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <CharacterArmory id={Number(id)} />
          </div>
        </div>
      )}
    </div>
  );
}
