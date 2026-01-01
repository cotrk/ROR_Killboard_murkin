import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { QueryPagination } from '@/components/global/QueryPagination';
import { GoldPrice } from '@/components/GoldPrice';
import { ReactElement } from 'react';

const VENDOR_ITEMS = gql`
  query GetVendorItemsFromCreature(
    $creatureId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    creature(id: $creatureId) {
      id
      vendorItems(first: $first, last: $last, before: $before, after: $after) {
        nodes {
          count
          item {
            id
            name
            iconUrl
          }
          price
          requiredItems {
            count
            item {
              id
              name
              iconUrl
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

interface VendorItemsProps {
  creatureId: string;
}

export function VendorItems({ creatureId }: VendorItemsProps): ReactElement {
  const { t } = useTranslation(['common', 'items']);

  const { loading, error, data, fetchMore } = useQuery(VENDOR_ITEMS, {
    variables: { creatureId, first: 20 },
  });

  if (loading) return <LoadingState message="Loading vendor items..." />;
  if (error) return <div className="alert alert-error">Error loading vendor items: {error.message}</div>;
  if (!data?.creature?.vendorItems?.nodes.length) {
    return <div className="alert alert-info">No vendor items available</div>;
  }

  const vendorItems = data.creature.vendorItems.nodes;
  const pageInfo = data.creature.vendorItems.pageInfo;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Vendor Items</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              {vendorItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded">
                          <img
                            src={item.item.iconUrl}
                            alt={item.item.name}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <Link 
                        to={`/item/${item.item.id}`} 
                        className="link-hover link-primary"
                      >
                        {item.item.name}
                      </Link>
                    </div>
                  </td>
                  <td>{item.count}</td>
                  <td>
                    <GoldPrice price={item.price} />
                  </td>
                  <td>
                    {item.requiredItems && item.requiredItems.length > 0 ? (
                      <div className="space-y-1">
                        {item.requiredItems.map((req: any, reqIndex: number) => (
                          <div key={reqIndex} className="flex items-center gap-2 text-sm">
                            <div className="avatar">
                              <div className="w-6 h-6 rounded">
                                <img
                                  src={req.item.iconUrl}
                                  alt={req.item.name}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <span>{req.count}x</span>
                            <Link 
                              to={`/item/${req.item.id}`} 
                              className="link-hover link-info truncate max-w-20"
                            >
                              {req.item.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base-content/60">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <div className="flex justify-center gap-2">
            {pageInfo.hasPreviousPage && (
              <button className="btn btn-outline btn-sm">Previous</button>
            )}
            {pageInfo.hasNextPage && (
              <button className="btn btn-outline btn-sm">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
