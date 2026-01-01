import { format, formatISO } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Kill } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';

export function KillsListTable({
  data,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  data: Kill[];
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {showTime && <th className="text-left">{t('components:killsList.time')}</th>}
            {showVictim && <th className="text-left">{t('components:killsList.victim')}</th>}
            {showKiller && <th className="text-left">{t('components:killsList.killer')}</th>}
            <th className="text-left">{t('components:killsList.zone')}</th>
            <th className="text-left">{t('components:killsList.type')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((kill: any) => {
            const date = new Date(kill.time * 1000);

            return (
              <tr key={kill.id} className="hover">
                {showTime && (
                  <td className="text-sm">
                    <div>{formatISO(date, { representation: 'date' })}</div>
                    <div className="text-xs text-base-content/60">{format(date, 'HH:mm:ss')}</div>
                  </td>
                )}
                {showVictim && (
                  <td>
                    <div className="flex items-center gap-2">
                      <CareerIcon career={kill.victim.character.career} />
                      <div className="flex-1">
                        <Link 
                          to={`/character/${kill.victim.character.id}`} 
                          className="link-hover link-primary"
                        >
                          {kill.victim.character.name}
                        </Link>
                        <div className="text-sm text-base-content/60">
                          <Link 
                            to={`/guild/${kill.victim.guild?.id}`}
                            className="link-hover link-info"
                          >
                            {kill.victim.guild?.name}
                          </Link>
                        </div>
                      </div>
                      <div className="text-sm text-right text-base-content/60">
                        <div>Lv {kill.victim.level}</div>
                        <div>RR {kill.victim.renownRank}</div>
                      </div>
                    </div>
                  </td>
                )}
                {showKiller && (
                  <td>
                    <div className="flex items-center gap-2">
                      <CareerIcon career={kill.attackers[0].character.career} />
                      <div className="flex-1">
                        <Link 
                          to={`/character/${kill.attackers[0].character.id}`} 
                          className="link-hover link-primary"
                        >
                          {kill.attackers[0].character.name}
                        </Link>
                        <div className="text-sm text-base-content/60">
                          <Link 
                            to={`/guild/${kill.attackers[0].guild?.id}`}
                            className="link-hover link-info"
                          >
                            {kill.attackers[0].guild?.name}
                          </Link>
                        </div>
                      </div>
                      <div className="text-sm text-right text-base-content/60">
                        <div>Lv {kill.attackers[0].level}</div>
                        <div>RR {kill.attackers[0].renownRank}</div>
                      </div>
                    </div>
                  </td>
                )}
                <td>
                  {kill.scenario == null ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">
                        <img
                          src="/images/icons/rvr.png"
                          alt="RvR"
                          title="RvR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div>{kill.position.zone?.name}</div>
                        {kill.attackers[0].damagePercent === 100 && (
                          <div className="flex items-center gap-2 text-warning">
                            <i className="fas fa-star"></i>
                            <span className="font-medium">
                              {t('components:killsList.soloKill')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">
                        <img
                          src="/images/icons/scenario.png"
                          alt="Scenario"
                          title="Scenario"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/scenario/${kill.scenario.id}`}
                          className="link-hover link-info"
                        >
                          {kill.scenario.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  <span className={clsx(
                    'badge badge-sm',
                    kill.attackers[0].damagePercent === 100 ? 'badge-success' : 'badge-warning'
                  )}>
                    {kill.attackers[0].damagePercent === 100 ? 'SOLO' : 'GROUP'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
