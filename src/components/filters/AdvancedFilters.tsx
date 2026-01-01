import React, { useState } from 'react';
import { DateRangeSelector } from '@/components/charts/DateRangeSelector';
import { FilterState } from '@/types';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { 
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    careers: [],
    zones: [],
    minLevel: 1,
    maxLevel: 40,
    ...initialFilters
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: { 
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      careers: [],
      zones: [],
      minLevel: 1,
      maxLevel: 40,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = filters.careers.length > 0 || 
                          filters.zones.length > 0 || 
                          filters.minLevel !== 1 || 
                          filters.maxLevel !== 40;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-primary">Advanced Filters</h3>
          {hasActiveFilters && (
            <button 
              className="btn btn-sm btn-error btn-outline"
              onClick={resetFilters}
            >
              Reset All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date Range</span>
            </label>
            <DateRangeSelector
              onRangeChange={(dateRange) => updateFilter('dateRange', dateRange)}
              initialRange={filters.dateRange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Careers</span>
            </label>
            <select 
              className="select select-bordered"
              multiple
              value={filters.careers}
              onChange={(e) => updateFilter('careers', Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="warrior">Warrior</option>
              <option value="engineer">Engineer</option>
              <option value="shaman">Shaman</option>
              <option value="magus">Magus</option>
              <option value="witchElf">Witch Elf</option>
              <option value="squigHerder">Squig Herder</option>
              <option value="blackOrc">Black Orc</option>
              <option value="choppa">Choppa</option>
              <option value="knight">Knight</option>
              <option value="brightWizard">Bright Wizard</option>
              <option value="runepriest">Runepriest</option>
              <option value="ironBreaker">Iron Breaker</option>
              <option value="slayer">Slayer</option>
              <option value="archmage">Archmage</option>
              <option value="warriorPriest">Warrior Priest</option>
              <option value="chosen">Chosen</option>
              <option value="zealot">Zealot</option>
              <option value="marauder">Marauder</option>
              <option value="sorcerer">Sorcerer</option>
              <option value="disciple">Disciple</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Zones</span>
            </label>
            <select 
              className="select select-bordered"
              multiple
              value={filters.zones}
              onChange={(e) => updateFilter('zones', Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="altdorf">Altdorf</option>
              <option value="inevitableCity">Inevitable City</option>
              <option value="reikland">Reikland</option>
              <option value="ostermark">Ostermark</option>
              <option value="talabecland">Talabecland</option>
              <option value="highpass">High Pass</option>
              <option value="blackfire">Blackfire Pass</option>
              <option value="caer">Caer</option>
              <option value="ebon">Ebon</option>
              <option value="grovewood">Grovewood</option>
              <option value="cliff">Cliff</option>
              <option value="khaine">Khaine</option>
              <option value="bloodhorn">Bloodhorn</option>
              <option value="tor">Tor</option>
              <option value="zandri">Zandri</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Level Range</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="input input-bordered input-sm w-20"
                min="1"
                max="40"
                value={filters.minLevel}
                onChange={(e) => updateFilter('minLevel', parseInt(e.target.value) || 1)}
                placeholder="Min"
              />
              <span className="self-center">-</span>
              <input
                type="number"
                className="input input-bordered input-sm w-20"
                min="1"
                max="40"
                value={filters.maxLevel}
                onChange={(e) => updateFilter('maxLevel', parseInt(e.target.value) || 40)}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
