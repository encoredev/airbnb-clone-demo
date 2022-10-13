import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Listing = {
  __typename?: 'Listing';
  description: Scalars['String'];
  distance_km: Scalars['Float'];
  host: User;
  id: Scalars['Int'];
  location: Scalars['String'];
  picture_url: Scalars['String'];
  price_per_night: Scalars['Int'];
  rating: Scalars['Float'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getListing?: Maybe<Listing>;
  listings: Array<Listing>;
};


export type QueryGetListingArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  pictureURL?: Maybe<Scalars['String']>;
};

export type IndexViewQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexViewQuery = { __typename?: 'Query', listings: Array<{ __typename?: 'Listing', id: number, title: string, location: string, description: string, picture_url: string, distance_km: number, rating: number, price_per_night: number }> };

export type DetailViewQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DetailViewQuery = { __typename?: 'Query', getListing?: { __typename?: 'Listing', id: number, title: string, location: string, description: string, picture_url: string, distance_km: number, rating: number, price_per_night: number } | null };


export const IndexViewDocument = gql`
    query IndexView {
  listings {
    id
    title
    location
    description
    picture_url
    distance_km
    rating
    price_per_night
  }
}
    `;

export function useIndexViewQuery(options?: Omit<Urql.UseQueryArgs<IndexViewQueryVariables>, 'query'>) {
  return Urql.useQuery<IndexViewQuery, IndexViewQueryVariables>({ query: IndexViewDocument, ...options });
};
export const DetailViewDocument = gql`
    query DetailView($id: Int!) {
  getListing(id: $id) {
    id
    title
    location
    description
    picture_url
    distance_km
    rating
    price_per_night
  }
}
    `;

export function useDetailViewQuery(options: Omit<Urql.UseQueryArgs<DetailViewQueryVariables>, 'query'>) {
  return Urql.useQuery<DetailViewQuery, DetailViewQueryVariables>({ query: DetailViewDocument, ...options });
};