/**
 * KillChart Component
 * 
 * A unified, adaptive chart component that displays kill statistics with support for
 * multiple chart types and responsive behavior for both desktop and mobile devices.
 * 
 * Features:
 * - Touch/pointer device detection
 * - Multiple chart types (line, area, bar)
 * - Responsive layout handling
 * - Mobile-friendly interactions
 * - Data point click handling
 * 
 * @example
 * ```tsx
 * <KillChart 
 *   characterId="123"
 *   dateRange={{ start: '2024-01-01', end: '2024-01-31' }}
 *   type="line"
 *   height={300}
 *   onDataPointClick={(data) => console.log(data)}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useQuery } from '@apollo/client';
import { GET_KILL_CHART } from '@/graphql/queries/killQueries';
import { DateRange } from '@/types';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface KillChartData {
  date: string;
  kills: number;
  deaths?: number;
  renownGained?: number;
}

interface KillChartProps {
  characterId?: string | number;
  dateRange?: DateRange;
  title?: string;
  type?: 'line' | 'area' | 'bar';
  height?: number;
  onDataPointClick?: (data: any) => void;
  isMobile?: boolean;
}

export const KillChart: React.FC<KillChartProps> = ({ 
  characterId, 
  dateRange = { 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  title = 'Kill Trends',
  type,
  height,
  onDataPointClick,
  isMobile = false
}) => {
  const { preferences } = useUserPreferences();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  // Detect touch capabilities
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    detectTouch();
    window.addEventListener('resize', detectTouch);
    return () => window.removeEventListener('resize', detectTouch);
  }, []);

  // Determine chart type based on preferences and props
  const chartType = type || preferences.chartType || 'line';
  const chartHeight = height || (isTouchDevice || isMobile ? 250 : 300);

  // Validate and convert characterId
  const validCharacterId = characterId ? String(characterId) : null;

  const { data, loading, error } = useQuery(GET_KILL_CHART, {
    variables: { 
      characterId: validCharacterId
    },
    skip: !validCharacterId,
    errorPolicy: 'all',
  });

  if (loading) return <div className="flex justify-center items-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-warning">Error loading chart: {error.message}</div>;
  if (!validCharacterId) return <div className="alert alert-info">No character selected for chart</div>;

  // Transform the data to match the expected chart format
  const character = data?.character;
  const chartData: KillChartData[] = character ? [{
    date: new Date().toISOString().split('T')[0],
    kills: character.totalKills || 0,
    deaths: character.totalDeaths || 0,
    renownGained: character.renownGained || 0
  }] : [];

  const handleChartClick = (data: any) => {
    if (onDataPointClick && data && data.activePayload) {
      const payload = data.activePayload[0].payload;
      onDataPointClick(payload);
      
      // Show mobile details if touch device
      if (isTouchDevice || isMobile) {
        setSelectedDataPoint(payload);
      }
    }
  };

  const closeMobileDetails = () => {
    setSelectedDataPoint(null);
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      onClick: handleChartClick,
      style: { cursor: onDataPointClick ? 'pointer' : 'default' }
    };

    const axisProps = {
      stroke: '#877b69',
      tick: { 
        fill: '#877b69', 
        fontSize: isTouchDevice || isMobile ? 10 : 12 
      },
      tickFormatter: (value: any) => new Date(value).toLocaleDateString()
    };

    const tooltipProps = {
      contentStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #877b69',
        borderRadius: '4px',
        fontSize: isTouchDevice || isMobile ? '12px' : '14px'
      },
      labelStyle: { color: '#e3d6c4' },
      formatter: (value: any) => [`${value} kills`, '']
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps} height={chartHeight}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Area 
              type="monotone" 
              dataKey="kills" 
              stroke="#bf4000" 
              strokeWidth={2}
              fill="#bf4000"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps} height={chartHeight}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Bar 
              dataKey="kills" 
              fill="#bf4000"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps} height={chartHeight}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Line 
              type="monotone" 
              dataKey="kills" 
              stroke="#bf4000" 
              strokeWidth={isTouchDevice || isMobile ? 3 : 2}
              dot={{ 
                fill: '#f90', 
                r: isTouchDevice || isMobile ? 6 : 4 
              }}
              activeDot={{ 
                r: isTouchDevice || isMobile ? 8 : 6 
              }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="kill-chart">
      <div className="card">
        <div className="card-content">
          <h3 className="title is-5">{title}</h3>
          
          <div className="chart-container" style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              {renderChart()}
            </ResponsiveContainer>
            
            {/* Touch hint for mobile */}
            {(isTouchDevice || isMobile) && onDataPointClick && (
              <div className="is-hidden-desktop">
                <div className="has-text-centered has-text-grey is-size-7 mt-2">
                  <span className="icon">
                    <i className="fas fa-hand-pointer"></i>
                  </span>
                  Tap data points for details
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile data point details */}
          {(isTouchDevice || isMobile) && selectedDataPoint && (
            <div className="is-hidden-desktop mt-3">
              <div className="notification is-info">
                <button className="delete" onClick={closeMobileDetails}></button>
                <div className="media">
                  <div className="media-content">
                    <p className="title is-6 mb-2">
                      {new Date(selectedDataPoint.date).toLocaleDateString()}
                    </p>
                    <p className="subtitle is-7">
                      <strong>Kills:</strong> {selectedDataPoint.kills}
                      {selectedDataPoint.deaths && (
                        <>
                          <br />
                          <strong>Deaths:</strong> {selectedDataPoint.deaths}
                        </>
                      )}
                      {selectedDataPoint.renownGained && (
                        <>
                          <br />
                          <strong>Renown:</strong> {selectedDataPoint.renownGained}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
