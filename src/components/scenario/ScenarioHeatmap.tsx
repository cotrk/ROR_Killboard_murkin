import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import { ReactElement } from 'react';

const SCENARIO_HEATMAP = gql`
  query GetScenarioHeatmap($id: ID) {
    killsHeatmap(instanceId: $id) {
      x
      y
      count
    }
  }
`;

export function ScenarioHeatmap({
  zoneId,
  id,
}: {
  zoneId: string;
  id: string;
}): ReactElement {
  const { t } = useTranslation(['common', 'scenarios']);

  const { loading, error, data } = useQuery<Query>(SCENARIO_HEATMAP, {
    variables: {
      id,
    },
  });

  const heatmapData = data?.killsHeatmap;

  if (loading) return <LoadingState message="Loading heatmap..." />;
  if (error) return <div className="alert alert-error">Error loading heatmap: {error.message}</div>;
  if (!heatmapData?.length) {
    return <div className="alert alert-info">No heatmap data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Kill Heatmap</h2>
        
        <div className="w-full h-96">
          <ZoneHeatmap 
            zoneId={zoneId}
            max={Math.max(...heatmapData.map(point => point.count))}
            data={heatmapData.map(point => [point.x, point.y, point.count])}
            size={400}
          />
        </div>
      </div>
    </div>
  );
}
