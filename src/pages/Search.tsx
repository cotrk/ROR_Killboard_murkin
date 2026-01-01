import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { CareerIcon } from '@/components/CareerIcon';
import { SearchWithSuggestions } from '@/components/global/SearchWithSuggestions';
import { LoadingState } from '@/components/shared/LoadingState';
import { useDataQueryHandler } from '@/components/shared/QueryState';
import { QueryPagination } from '@/components/global/QueryPagination';
import { SearchQuery } from '../__generated__/graphql';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { questTypeIcon } from '../utils';
import { ReactElement } from 'react';

const SEARCH = gql`
  query Search(
    $query: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    search(
      query: $query
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        __typename
        ... on Character {
          id
          name
          career
          level
          renownRank
          guildMembership {
            guild {
              id
              name
            }
          }
        }
        ... on Guild {
          id
          name
          level
          members {
            totalCount
          }
          heraldry
          realm
          leader {
            id
            name
          }
        }
        ... on Item {
          id
          name
          type
          slot
          iconUrl
          description
        }
        ... on Quest {
          id
          name
          minLevel
          questType
          repeatableType
          journalEntry
          questDescription: description
        }
        ... on Creature {
          id
          name
          creatureSubType
        }
        ... on Chapter {
          id
          name
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
`;

export function Search(): ReactElement {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, refetch } = useQuery<SearchQuery>(SEARCH, {
    variables: { query, first: perPage },
  });

  const { handleLoadingError } = useDataQueryHandler();
  const errorElement = handleLoadingError(
    loading,
    error ?? null,
    data?.search?.nodes,
  );
  if (errorElement) return errorElement;

  if (!data?.search?.nodes) {
    return <LoadingState />;
  }

  const { pageInfo } = data.search;

  const handleSubmit = (newQuery: string): void => {
    refetch({ query: newQuery, first: perPage });
  };

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">
                {t('common:home')}
              </Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:searchPage.search')}
            </li>
          </ul>
        </nav>
      </div>

      <SearchWithSuggestions
        initialQuery={query}
        onSubmit={handleSubmit}
        isPlayer
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra table-hover table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th className="text-left">Name</th>
              <th className="text-left">Info</th>
              <th className="text-right">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.search.nodes.map((searchItem) => {
              if (searchItem.__typename === 'Character') {
                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <CareerIcon career={searchItem.career} />
                    </td>
                    <td>
                      <Link
                        to={`/character/${searchItem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                      <div className="text-sm text-base-content/60 mt-1">
                        <Link
                          to={`/guild/${searchItem.guildMembership?.guild?.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {searchItem.guildMembership?.guild?.name}
                        </Link>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60">
                      <div>Lvl {searchItem.level}</div>
                      <div>RR {searchItem.renownRank}</div>
                    </td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Guild') {
                const heraldry = searchItem.heraldry
                  ? {
                      emblem: String(searchItem.heraldry.emblem),
                      pattern: String(searchItem.heraldry.pattern),
                      color1: String(searchItem.heraldry.color1),
                      color2: String(searchItem.heraldry.color2),
                      shape: String(searchItem.heraldry.shape),
                    }
                  : null;

                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <GuildHeraldry
                        heraldry={heraldry}
                        realm={searchItem.realm}
                        size="48"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/guild/${searchItem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                      <div className="text-sm text-base-content/60 mt-1">
                        Leader:{' '}
                        <Link
                          to={`/character/${searchItem.leader?.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {searchItem.leader?.name}
                        </Link>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60">
                      <div>Lvl {searchItem.level}</div>
                      <div>Members {searchItem.members?.totalCount}</div>
                    </td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Item') {
                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <Link to={`/item/${searchItem.id}`}>
                        <div className="w-12 h-12 m-0">
                          <img
                            src={searchItem.iconUrl}
                            alt={searchItem.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/item/${searchItem.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                      <div className="text-sm text-base-content/60 mt-1">
                        {t(`enums:itemType.${searchItem.type}`)}{' '}
                        {t(`enums:itemSlot.${searchItem.slot}`)}
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60">
                      {searchItem.description}
                    </td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Quest') {
                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <Link to={`/quest/${searchItem.id}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-info">
                            <img
                              src={`/images/icons/${questTypeIcon(
                                searchItem.questType,
                                searchItem.repeatableType,
                              )}`}
                              alt="Quest Type"
                              className="w-6 h-6"
                            />
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/quest/${searchItem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                      {searchItem.minLevel > 0 && (
                        <div className="text-sm text-base-content/60 mt-1">
                          Lvl: {searchItem.minLevel}
                        </div>
                      )}
                    </td>
                    <td className="text-sm text-base-content/60">
                      {searchItem.journalEntry ?? searchItem.questDescription}
                    </td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Creature') {
                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <Link to={`/creature/${searchItem.id}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-info">
                            <img
                              src="/images/icons/creature.png"
                              alt="Creature"
                              className="w-6 h-6"
                            />
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/creature/${searchItem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                    </td>
                    <td className="text-sm text-base-content/60">
                      {t(`enums:creatureSubType.${searchItem.creatureSubType}`)}
                    </td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Chapter') {
                return (
                  <tr key={searchItem.id} className="hover:bg-base-200">
                    <td>
                      <Link to={`/chapter/${searchItem.id}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-info">
                            <img
                              src="/images/corner_icons/ea_icon_corner_help.png"
                              width={48}
                              height={48}
                              alt={searchItem.name ?? undefined}
                              className="w-12 h-12 object-contain"
                            />
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/chapter/${searchItem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {searchItem.name}
                      </Link>
                    </td>
                    <td></td>
                    <td className="text-right">
                      <span className="badge badge-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              return null;
            })}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
