import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

export interface KillsFilters {
  soloOnly?: boolean;
  time?: {
    gte?: number;
    lte?: number;
  };
}

export function getCurrentFilters(search: URLSearchParams): KillsFilters {
  const filters: KillsFilters = {};

  const soloOnly = search.get('soloOnly');
  if (soloOnly) {
    filters.soloOnly = soloOnly === 'true';
  }

  const timeMin = search.get('timeMin');
  const timeMax = search.get('timeMax');
  if (timeMin || timeMax) {
    filters.time = {};
    if (timeMin) {
      filters.time.gte = parseInt(timeMin);
    }
    if (timeMax) {
      filters.time.lte = parseInt(timeMax);
    }
  }

  return filters;
}

export function KillsFilters(): ReactElement {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const period = search.get('period') || 'all';

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    search.set('period', event.target.value);
    setSearch(search);
  };

  const handleSoloOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      search.set('soloOnly', 'true');
    } else {
      search.delete('soloOnly');
    }
    setSearch(search);
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Kill Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time Period Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Time Period</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={period}
              onChange={handlePeriodChange}
            >
              <option value="all">All Time</option>
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          {/* Solo Kills Filter */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Solo Kills Only</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={search.has('soloOnly')}
                onChange={handleSoloOnlyChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
