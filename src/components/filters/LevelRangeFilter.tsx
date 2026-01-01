import React from 'react';
import { useTranslation } from 'react-i18next';

interface LevelRangeFilterProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export const LevelRangeFilter: React.FC<LevelRangeFilterProps> = ({ 
  min, 
  max, 
  onChange 
}) => {
  const { t } = useTranslation('components');

  const handleMinChange = (value: string) => {
    const newMin = parseInt(value) || 1;
    if (newMin <= max) {
      onChange(newMin, max);
    }
  };

  const handleMaxChange = (value: string) => {
    const newMax = parseInt(value) || 40;
    if (newMax >= min) {
      onChange(min, newMax);
    }
  };

  const presets = [
    { label: 'Tier 1', min: 1, max: 10 },
    { label: 'Tier 2', min: 11, max: 20 },
    { label: 'Tier 3', min: 21, max: 30 },
    { label: 'Tier 4', min: 31, max: 40 },
  ];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">Level Range</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Min Level</span>
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={min}
              onChange={(e) => handleMinChange(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Max Level</span>
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={max}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="divider">Presets</div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              className="btn btn-outline btn-sm"
              onClick={() => onChange(preset.min, preset.max)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
