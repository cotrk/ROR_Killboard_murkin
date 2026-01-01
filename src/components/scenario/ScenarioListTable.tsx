import { format, formatISO, intervalToDuration } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ScenarioRecord } from '@/__generated__/graphql';
import { ReactElement } from 'react';
import clsx from 'clsx';

export function ScenarioListTable({
  data,
}: {
  data: ScenarioRecord[];
}): ReactElement {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const { t } = useTranslation(['common', 'components']);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra table-hover table-compact w-full">
        <thead>
          <tr>
            <th className="text-left">{t('components:scenarioList.name')}</th>
            <th className="text-left">{t('components:scenarioList.time')}</th>
            <th className="text-left">{t('components:scenarioList.duration')}</th>
            <th className="text-center">{t('components:scenarioList.winner')}</th>
            <th className="text-right">{t('components:scenarioList.order')}</th>
            <th className="text-right">{t('components:scenarioList.destruction')}</th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((scenario) => {
            const startDate = new Date(scenario.startTime * 1000);
            const endDate = new Date(scenario.endTime * 1000);
            const duration = intervalToDuration({
              start: startDate,
              end: endDate,
            });

            return (
              <tr key={scenario.id} className="hover:bg-base-200">
                <td className="font-medium">{scenario.scenario.name}</td>
                <td className="text-sm">
                  <div>{formatISO(startDate, { representation: 'date' })}</div>
                  <div className="text-xs text-base-content/60">{format(startDate, 'HH:mm:ss')}</div>
                </td>
                <td className="text-sm">
                  {t(
                    duration.hours === 0
                      ? 'components:scenarioList.scenarioDuration'
                      : 'components:scenarioList.scenarioDurationHour',
                    {
                      hours: duration.hours,
                      minutes: duration.minutes,
                      seconds: duration.seconds,
                    },
                  )}
                </td>
                <td className="text-center">
                  {scenario.winner === 0 ? (
                    <img
                      src="/images/icons/scenario/order.png"
                      width={40}
                      height={40}
                      alt="Order"
                      className="mx-auto"
                    />
                  ) : (
                    <img
                      src="/images/icons/scenario/destruction.png"
                      width={40}
                      height={40}
                      alt="Destruction"
                      className="mx-auto"
                    />
                  )}
                </td>
                <td className="text-right font-medium text-primary">
                  {scenario.points[0]}
                </td>
                <td className="text-right font-medium text-secondary">
                  {scenario.points[1]}
                </td>
                <td className="text-center">
                  <Link
                    to={`/scenario/${scenario.id}`}
                    className="btn btn-xs btn-primary"
                  >
                    {t('components:scenarioList.details')}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
