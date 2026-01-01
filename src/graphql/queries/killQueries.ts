import { gql } from '@apollo/client';

export const GET_KILL_CHART = gql`
  query GetKillChart($characterId: ID!) {
    character(id: $characterId) {
      id
      name
      totalKills
      totalDeaths
      renownGained
    }
  }
`;

export const GET_LIVE_KILLS_SUBSCRIPTION = gql`
  subscription GetLiveKills {
    liveKills {
      id
      victim { 
        name
        level
        renownRank
        career
        character {
          id
          career
          name
        }
        guild {
          id
          name
        }
      }
      attackers { 
        name
        damagePercent
        character {
          id
          career
          name
        }
        guild {
          id
          name
        }
      }
      time
      zone { 
        id
        name
      }
    }
  }
`;

export const SEARCH_ENTITIES = gql`
  query SearchEntities($query: String!, $type: SearchType!) {
    search(query: $query, type: $type) {
      id
      name
      type
      description
    }
  }
`;

export const SEARCH = gql`
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

export const GET_CHARACTER_STATS = gql`
  query GetCharacterStats($id: ID!) {
    character(id: $id) {
      id
      name
      level
      renownRank
      career
      guild {
        id
        name
      }
      totalKills
      totalDeaths
      renownGained
      recentKills(first: 10) {
        nodes {
          id
          time
          victim {
            name
            level
            renownRank
            career
          }
          attackers {
            name
            damagePercent
          }
        }
      }
    }
  }
`;
