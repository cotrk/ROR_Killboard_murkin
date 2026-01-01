import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange } from '@/types';

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  onRangeChange, 
  initialRange 
}) => {
  const { t } = useTranslation('components');
  const [selectedRange, setSelectedRange] = useState('7d');
  const [customStart, setCustomStart] = useState(initialRange?.start || '');
  const [customEnd, setCustomEnd] = useState(initialRange?.end || '');

  const ranges = {
    '1d': { label: 'Last 24h', days: 1 },
    '7d': { label: 'Last 7 days', days: 7 },
    '30d': { label: 'Last 30 days', days: 30 },
    '90d': { label: 'Last 90 days', days: 90 },
    'custom': { label: 'Custom Range', days: 0 }
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    if (range === 'custom') {
      if (customStart && customEnd) {
        onRangeChange({ start: customStart, end: customEnd });
      }
    } else {
      const rangeData = ranges[range as keyof typeof ranges];
      const days = rangeData.days;
      const end = new Date();
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
      onRangeChange({ 
        start: start.toISOString(), 
        end: end.toISOString() 
      });
    }
  };

  const handleCustomDateChange = () => {
    if (customStart && customEnd) {
      const newRange = {
        start: new Date(customStart).toISOString(),
        end: new Date(customEnd).toISOString()
      };
      onRangeChange(newRange);
    }
  };

  return (
    <div className="date-range-selector">
      <div className="form-control">
        <div className="select select-bordered w-full">
          <select 
            value={selectedRange} 
            onChange={(e) => handleRangeChange(e.target.value)}
            className="w-full"
          >
            {Object.entries(ranges).map(([key, range]) => (
              <option key={key} value={key}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRange === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">From</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">To</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">&nbsp;</span>
            </label>
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={handleCustomDateChange}
              disabled={!customStart || !customEnd}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
