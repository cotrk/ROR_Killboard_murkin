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
  { id: 'knight', name: 'Knight of Blazing Sun', icon: 'fas fa-shield-alt' },
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
  const { t } = useTranslation(['common', 'filters']);

  const handleCareerToggle = (careerId: string) => {
    const newSelected = selected.includes(careerId)
      ? selected.filter(id => id !== careerId)
      : [...selected, careerId];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    onChange(CAREERS.map(career => career.id));
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">Careers</h3>
        
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CAREERS.map((career) => (
            <div 
              key={career.id}
              className={`
                card cursor-pointer transition-all
                ${selected.includes(career.id) 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300'
                }
              `}
              onClick={() => handleCareerToggle(career.id)}
            >
              <div className="card-body p-3 text-center">
                <div className="text-2xl mb-2">
                  <i className={career.icon}></i>
                </div>
                <div className="text-sm font-medium">
                  {career.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
