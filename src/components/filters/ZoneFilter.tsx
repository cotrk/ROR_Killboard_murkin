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
    onChange(ZONES.map(zone => zone.id));
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'city':
        return 'badge badge-info';
      case 'zone':
        return 'badge badge-warning';
      default:
        return 'badge badge-outline';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">Zones</h3>
        
        <div className="flex gap-2 mb-4">
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleSelectAll}
          >
            All
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleSelectNone}
          >
            None
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ZONES.map((zone) => (
            <div 
              key={zone.id}
              className={`
                card cursor-pointer transition-all
                ${selected.includes(zone.id) 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300'
                }
              `}
              onClick={() => handleToggle(zone.id)}
            >
              <div className="card-body p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">
                    {zone.name}
                  </div>
                  <span className={`badge badge-sm ${getTypeBadge(zone.type)}`}>
                    {zone.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
