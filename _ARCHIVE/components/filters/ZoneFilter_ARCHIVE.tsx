import React from 'react';
import { useTranslation } from 'react-i18next';

interface ZoneFilterProps {
  selected: string[];
  onChange: (zones: string[]) => void;
}

const ZONES = [
  { id: 'altdorf', name: 'Altdorf', type: 'city' },
  { id: 'reikland', name: 'Reikland', type: 'zone' },
  { id: 'ostland', name: 'Ostland', type: 'zone' },
  { id: 'nordland', name: 'Nordland', type: 'zone' },
  { id: 'troll_country', name: 'Troll Country', type: 'zone' },
  { id: 'chaos_wastes', name: 'Chaos Wastes', type: 'zone' },
  { id: 'black_crag', name: 'Black Crag', type: 'zone' },
  { id: 'badlands', name: 'Badlands', type: 'zone' },
  { id: 'dragonwake', name: 'Dragonwake', type: 'zone' },
  { id: 'elven_ruins', name: 'Elven Ruins', type: 'zone' },
];

export const ZoneFilter: React.FC<ZoneFilterProps> = ({ 
  selected, 
  onChange 
}) => {
  const { t } = useTranslation('components');

  const handleToggle = (zoneId: string) => {
    const newSelection = selected.includes(zoneId)
      ? selected.filter(id => id !== zoneId)
      : [...selected, zoneId];
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    onChange(ZONES.map(z => z.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'city': return 'is-primary';
      case 'zone': return 'is-info';
      default: return 'is-light';
    }
  };

  return (
    <div className="zone-filter">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <span className="has-text-weight-bold">Zones</span>
        <div className="buttons are-small">
          <button 
            className="button is-small is-outlined"
            onClick={handleSelectAll}
            disabled={selected.length === ZONES.length}
          >
            All
          </button>
          <button 
            className="button is-small is-outlined"
            onClick={handleClearAll}
            disabled={selected.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="columns is-multiline is-mobile">
        {ZONES.map((zone) => (
          <div key={zone.id} className="column is-half">
            <label className="checkbox is-small">
              <input
                type="checkbox"
                checked={selected.includes(zone.id)}
                onChange={() => handleToggle(zone.id)}
                className="mr-2"
              />
              <span className="tag is-small mr-1">
                {zone.name}
              </span>
              <span className={`tag is-small ${getZoneTypeColor(zone.type)}`}>
                {zone.type}
              </span>
            </label>
          </div>
        ))}
      </div>
      
      {selected.length > 0 && (
        <div className="mt-2">
          <span className="tag is-small is-info">
            {selected.length} zones selected
          </span>
        </div>
      )}
    </div>
  );
};
