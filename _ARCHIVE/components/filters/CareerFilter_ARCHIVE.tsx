import React from 'react';
import { useTranslation } from 'react-i18next';

interface CareerFilterProps {
  selected: string[];
  onChange: (careers: string[]) => void;
}

const CAREERS = [
  { id: 'bright_wizard', name: 'Bright Wizard', icon: 'fas fa-fire' },
  { id: 'warrior_priest', name: 'Warrior Priest', icon: 'fas fa-hammer' },
  { id: 'witch_hunter', name: 'Witch Hunter', icon: 'fas fa-crosshairs' },
  { id: 'knight', name: 'Knight of the Blazing Sun', icon: 'fas fa-shield-alt' },
  { id: 'engineer', name: 'Engineer', icon: 'fas fa-cog' },
  { id: 'slayer', name: 'Slayer', icon: 'fas fa-axe' },
  { id: 'ironbreaker', name: 'Ironbreaker', icon: 'fas fa-shield' },
  { id: 'runepriest', name: 'Runepriest', icon: 'fas fa-scroll' },
  { id: 'magus', name: 'Magus', icon: 'fas fa-hat-wizard' },
  { id: 'chosen', name: 'Chosen', icon: 'fas fa-skull' },
  { id: 'marauder', name: 'Marauder', icon: 'fas fa-fist-raised' },
  { id: 'shaman', name: 'Shaman', icon: 'fas fa-bolt' },
  { id: 'black_orc', name: 'Black Orc', icon: 'fas fa-club' },
  { id: 'squig_herder', name: 'Squig Herder', icon: 'fas fa-dog' },
  { id: 'zealot', name: 'Zealot', icon: 'fas fa-book-dead' },
];

export const CareerFilter: React.FC<CareerFilterProps> = ({ 
  selected, 
  onChange 
}) => {
  const { t } = useTranslation('components');

  const handleToggle = (careerId: string) => {
    const newSelection = selected.includes(careerId)
      ? selected.filter(id => id !== careerId)
      : [...selected, careerId];
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    onChange(CAREERS.map(c => c.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="career-filter">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <span className="has-text-weight-bold">Careers</span>
        <div className="buttons are-small">
          <button 
            className="button is-small is-outlined"
            onClick={handleSelectAll}
            disabled={selected.length === CAREERS.length}
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
        {CAREERS.map((career) => (
          <div key={career.id} className="column is-half">
            <label className="checkbox is-small">
              <input
                type="checkbox"
                checked={selected.includes(career.id)}
                onChange={() => handleToggle(career.id)}
                className="mr-2"
              />
              <span className="icon is-small mr-1">
                <i className={career.icon}></i>
              </span>
              <span className="is-size-7">{career.name}</span>
            </label>
          </div>
        ))}
      </div>
      
      {selected.length > 0 && (
        <div className="mt-2">
          <span className="tag is-small is-info">
            {selected.length} selected
          </span>
        </div>
      )}
    </div>
  );
};
