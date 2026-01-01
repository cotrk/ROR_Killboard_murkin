import { gql, useQuery } from '@apollo/client';
import { KillDamage, Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { killDamageText } from '@/utils';
import { ReactElement } from 'react';

const SKIRMISH_DAMAGE = gql`
  query GetSkirmishDamage($id: ID!) {
    skirmish(id: $id) {
      id
      killDamage {
        attackerType
        damageType
        ability {
          id
          name
          iconUrl
        }
        damageAmount
      }
    }
  }
`;

export function SkirmishDamage({ id }: { id: string }): ReactElement {
  const { loading, error, data } = useQuery<Query>(SKIRMISH_DAMAGE, {
    variables: { id },
  });

  const killDamage = data?.skirmish?.killDamage;

  if (loading) return <LoadingState message="Loading damage data..." />;
  if (error) return <div className="alert alert-error">Error loading damage: {error.message}</div>;
  if (!killDamage?.length) {
    return <div className="alert alert-info">No damage data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Damage Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Attacker</th>
                <th>Damage Type</th>
                <th>Ability</th>
                <th>Damage</th>
              </tr>
            </thead>
            <tbody>
              {killDamage.map((damage: any, index: number) => (
                <tr key={index}>
                  <td>
                    <span className={`
                      badge badge-sm
                      ${damage.attackerType === 'PLAYER' ? 'badge-primary' : 'badge-secondary'}
                    `}>
                      {damage.attackerType}
                    </span>
                  </td>
                  <td>
                    <span className={`
                      badge badge-sm
                      ${damage.damageType === 'DIRECT' ? 'badge-error' : 'badge-warning'}
                    `}>
                      {killDamageText(damage.damageType)}
                    </span>
                  </td>
                  <td>
                    {damage.ability && (
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-6 h-6 rounded">
                            <img
                              src={damage.ability.iconUrl}
                              alt={damage.ability.name}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <span className="text-sm">
                          {damage.ability.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="font-mono text-lg">
                    {damage.damageAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
