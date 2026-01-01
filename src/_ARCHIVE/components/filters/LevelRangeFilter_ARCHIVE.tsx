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

  const handleRangeChange = (range: string) => {
    switch (range) {
      case 'low':
        onChange(1, 15);
        break;
      case 'mid':
        onChange(16, 30);
        break;
      case 'high':
        onChange(31, 40);
        break;
      case 'all':
        onChange(1, 40);
        break;
    }
  };

  return (
    <div className="level-range-filter">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <span className="has-text-weight-bold">Level Range</span>
      </div>
      
      <div className="buttons are-small mb-3">
        <button 
          className="button is-small is-outlined"
          onClick={() => handleRangeChange('low')}
        >
          Low (1-15)
        </button>
        <button 
          className="button is-small is-outlined"
          onClick={() => handleRangeChange('mid')}
        >
          Mid (16-30)
        </button>
        <button 
          className="button is-small is-outlined"
          onClick={() => handleRangeChange('high')}
        >
          High (31-40)
        </button>
        <button 
          className="button is-small is-outlined"
          onClick={() => handleRangeChange('all')}
        >
          All (1-40)
        </button>
      </div>
      
      <div className="columns is-mobile">
        <div className="column">
          <div className="field">
            <label className="label is-small">Min Level</label>
            <div className="control">
              <input
                type="number"
                className="input is-small"
                min="1"
                max="40"
                value={min}
                onChange={(e) => handleMinChange(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label is-small">Max Level</label>
            <div className="control">
              <input
                type="number"
                className="input is-small"
                min="1"
                max="40"
                value={max}
                onChange={(e) => handleMaxChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <span className="tag is-small is-info">
          Levels {min}-{max}
        </span>
      </div>
    </div>
  );
};
