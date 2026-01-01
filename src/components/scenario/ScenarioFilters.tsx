import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const getQueueTypeFilters = (search: URLSearchParams) => {
  const queueType = search.get('queue_type');
  const premadeOnly = search.get('premadeOnly') === 'true' ? true : undefined;

  switch (queueType) {
    case 'standard':
    case 'solo':
    case 'city_siege':
    case 'group_ranked':
    case 'solo_ranked':
      return {
        queueType: queueType?.toUpperCase(),
        premadeOnly,
      };
  }

  return { premadeOnly };
};

export const getScenarioFilters = (search: URLSearchParams) => ({
  ...getQueueTypeFilters(search),
});

export function ScenarioFilters({
  showPremadeOnly = false,
}: {
  showPremadeOnly?: boolean;
}): ReactElement {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const queueType = search.get('queue_type') || 'all';

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label" htmlFor="queueType-select">
              <span className="label-text">{t('scenarioFilters.queueType')}</span>
            </label>
            <select
              id="queueType-select"
              className="select select-bordered"
              value={queueType}
              onChange={(event) => {
                search.set('queue_type', event.target.value);
                setSearch(search);
              }}
            >
              <option value="all">
                {t('scenarioFilters.queueTypeAll')}
              </option>
              <option value="standard">
                {t('scenarioFilters.queueTypeStandard')}
              </option>
              <option value="solo">
                {t('scenarioFilters.queueTypeSolo')}
              </option>
              <option value="city_siege">
                {t('scenarioFilters.queueTypeCitySiege')}
              </option>
              <option value="group_ranked">
                {t('scenarioFilters.queueTypeGroupRanked')}
              </option>
              <option value="solo_ranked">
                {t('scenarioFilters.queueTypeSoloRanked')}
              </option>
            </select>
          </div>
          {showPremadeOnly && (
            <div className="form-control">
              <label className="label cursor-pointer" title="Scenarios with 6+ guild members only">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={search.has('premadeOnly')}
                  onChange={(event) => {
                    if (event.target.checked) search.set('premadeOnly', 'true');
                    else search.delete('premadeOnly');
                    setSearch(search);
                  }}
                />
                <span className="label-text ml-2">{t('scenarioFilters.premadeOnly')}</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
