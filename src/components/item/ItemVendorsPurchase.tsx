import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { GoldPrice } from '@/components/GoldPrice';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import {
  ItemVendorsFilters,
  getCurrentFilters,
} from '@/components/item/ItemVendorsFilters';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ReactElement } from 'react';

const ITEM_INFO = gql`
  query GetItemUsedToPurchase(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $usableByCareer: Career
  ) {
    item(id: $itemId) {
      id
      usedToPurchase(
        first: $first
        last: $last
        before: $before
        after: $after
        usableByCareer: $usableByCareer
      ) {
        nodes {
          id
          vendor {
            id
            name
            realm
          }
          price
          quantity
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

interface ItemVendorsPurchaseProps {
  itemId: string;
}

export function ItemVendorsPurchase({ itemId }: ItemVendorsPurchaseProps): ReactElement {
  const { t } = useTranslation(['common', 'items']);
  const [searchParams] = useSearchParams();
  const filters = getCurrentFilters(searchParams);

  const { loading, error, data } = useQuery(ITEM_INFO, {
    variables: {
      itemId,
      first: 20,
      usableByCareer: filters.career || undefined,
    },
  });

  if (loading) return <LoadingState message="Loading vendor information..." />;
  if (error) return <div className="alert alert-error">Error loading vendors: {error.message}</div>;
  if (!data?.item?.usedToPurchase?.nodes.length) {
    return <div className="alert alert-info">No vendors sell this item</div>;
  }

  const vendors = data.item.usedToPurchase.nodes;
  const pageInfo = data.item.usedToPurchase.pageInfo;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Purchase From Vendors</h2>
        
        <div className="mb-4">
          <ItemVendorsFilters />
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor: any, index: number) => (
                <tr key={vendor.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        vendor.vendor.realm === 'Destruction' ? 'badge-error' : 'badge-info'
                      }`}>
                        {vendor.vendor.realm}
                      </span>
                      <Link 
                        to={`/vendor/${vendor.vendor.id}`} 
                        className="link-hover link-primary"
                      >
                        {vendor.vendor.name}
                      </Link>
                    </div>
                  </td>
                  <td>
                    <GoldPrice price={vendor.price} />
                  </td>
                  <td>{vendor.quantity}</td>
                  <td>
                    {vendor.requiredItems && vendor.requiredItems.length > 0 ? (
                      <div className="space-y-1">
                        {vendor.requiredItems.map((req: any, reqIndex: number) => (
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
