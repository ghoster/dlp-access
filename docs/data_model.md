```
interface Object {
  id: ID!
  title: String!
  identifier: String!
  description: String
  creator: [String!]
  source: [String!]
  circa: String
  start_date: String
  end_date: String
  location: [String!]
  rights_statement: String
  language: [String!]
  related_url: [String!]
  provenance: [String!]
  belongs_to: [String!]
  bibliographic_citation: String
  rights_holder: String
  custom_key: String
  visibility: Boolean!
  thumbnail_path: String
  parent_collection: [String!]
  create_date: String!
  modified_date: String!
}


type Collection implements Object
  @model
  @searchable
  @key(
    fields: ["identifier"]
    name: "Identifier"
    queryField: "collectionByIdentifier"
  ) {
  id: ID!
  title: String!
  identifier: String!
  description: String
  creator: [String!]
  source: [String!]
  circa: String
  start_date: String
  end_date: String
  subject: [String!]
  location: [String!]
  rights_statement: String
  language: [String!]
  related_url: [String!]
  provenance: [String!]
  belongs_to: [String!]
  bibliographic_citation: String
  rights_holder: String
  custom_key: String
  collection_category: String!
  visibility: Boolean!
  thumbnail_path: String
  parent_collection: [String!]
  create_date: String!
  modified_date: String!
  archives: [Archive] @connection(name: "CollectionArchives")
}
type Archive implements Object
  @model
  @searchable
  @key(
    fields: ["identifier"]
    name: "Identifier"
    queryField: "archiveByIdentifier"
  ) {
  id: ID!
  title: String!
  identifier: String!
  description: String
  tags: [String!]
  creator: [String!]
  source: [String!]
  circa: String
  start_date: String
  end_date: String
  rights_statement: String
  language: [String!]
  resource_type: [String!]
  belongs_to: [String!]
  location: [String!]
  medium: [String!]
  bibliographic_citation: String
  rights_holder: String
  format: [String!]
  related_url: [String!]
  provenance: [String!]
  repository: [String!]
  reference: [String!]
  contributor: [String!]
  custom_key: String
  parent_collection: [String!]
  item_category: String!
  visibility: Boolean!
  thumbnail_path: String
  manifest_url: String!
  create_date: String!
  modified_date: String!
  collection: Collection @connection(name: "CollectionArchives")
}
type Query {
  searchObjects(
    allFields: String
    sort: SearchableObjectSortInput
    filter: SearchableObjectFilterInput
    limit: Int
    nextToken: String
    category: String
  ): SearchableObjectConnection
  fulltextCollections(
    allFields: String
    filter: SearchableCollectionFilterInput
    sort: SearchableCollectionSortInput
    limit: Int
    nextToken: String
  ): SearchableCollectionConnection
  fulltextArchives(
    allFields: String
    filter: SearchableArchiveFilterInput
    sort: SearchableArchiveSortInput
    limit: Int
    nextToken: String
  ): SearchableArchiveConnection
}

type SearchableObjectConnection {
  items: [Object]
  nextToken: String
  total: Int
}

input SearchableObjectFilterInput {
  id: SearchableIDFilterInput
  title: SearchableStringFilterInput
  identifier: SearchableStringFilterInput
  description: SearchableStringFilterInput
  tags: SearchableStringFilterInput
  creator: SearchableStringFilterInput
  source: SearchableStringFilterInput
  circa: SearchableStringFilterInput
  start_date: SearchableStringFilterInput
  end_date: SearchableStringFilterInput
  subject: SearchableStringFilterInput
  belongs_to: SearchableStringFilterInput
  location: SearchableStringFilterInput
  medium: SearchableStringFilterInput
  rights_statement: SearchableStringFilterInput
  language: SearchableStringFilterInput
  resource_type: SearchableStringFilterInput
  bibliographic_citation: SearchableStringFilterInput
  rights_holder: SearchableStringFilterInput
  format: SearchableStringFilterInput
  custom_key: SearchableStringFilterInput
  visibility: SearchableBooleanFilterInput
  thumbnail_path: SearchableStringFilterInput
  parent_collection: SearchableStringFilterInput
  create_date: SearchableStringFilterInput
  modified_date: SearchableStringFilterInput
  collection_category: SearchableStringFilterInput
  item_category: SearchableStringFilterInput
  and: [SearchableObjectFilterInput]
  or: [SearchableObjectFilterInput]
  not: SearchableObjectFilterInput
}

input SearchableBooleanFilterInput {
  eq: Boolean
  ne: Boolean
}

input SearchableObjectSortInput {
  field: SearchableObjectSortableFields
  direction: SearchableSortDirection
}

enum SearchableObjectSortableFields {
  id
  title
  identifier
  description
  creator
  source
  start_date
  end_date
  subject
  location
  language
  custom_key
}

type SearchableCollectionConnection {
  items: [Collection]
  nextToken: String
  total: Int
}

input SearchableCollectionFilterInput {
  id: SearchableIDFilterInput
  title: SearchableStringFilterInput
  identifier: SearchableStringFilterInput
  description: SearchableStringFilterInput
  creator: SearchableStringFilterInput
  source: SearchableStringFilterInput
  circa: SearchableStringFilterInput
  start_date: SearchableStringFilterInput
  end_date: SearchableStringFilterInput
  subject: SearchableStringFilterInput
  location: SearchableStringFilterInput
  rights_statement: SearchableStringFilterInput
  language: SearchableStringFilterInput
  related_url: SearchableStringFilterInput
  provenance: SearchableStringFilterInput
  belongs_to: SearchableStringFilterInput
  bibliographic_citation: SearchableStringFilterInput
  rights_holder: SearchableStringFilterInput
  custom_key: SearchableStringFilterInput
  collection_category: SearchableStringFilterInput
  visibility: SearchableBooleanFilterInput
  thumbnail_path: SearchableStringFilterInput
  parent_collection: SearchableStringFilterInput
  create_date: SearchableStringFilterInput
  modified_date: SearchableStringFilterInput
  and: [SearchableCollectionFilterInput]
  or: [SearchableCollectionFilterInput]
  not: SearchableCollectionFilterInput
}

input SearchableCollectionSortInput {
  field: SearchableCollectionSortableFields
  direction: SearchableSortDirection
}

enum SearchableCollectionSortableFields {
  id
  title
  identifier
  description
  creator
  source
  circa
  start_date
  end_date
  subject
  location
  rights_statement
  language
  related_url
  provenance
  belongs_to
  bibliographic_citation
  rights_holder
  custom_key
  collection_category
  visibility
  thumbnail_path
  parent_collection
  create_date
  modified_date
}

type SearchableArchiveConnection {
  items: [Archive]
  nextToken: String
  total: Int
}

input SearchableArchiveFilterInput {
  id: SearchableIDFilterInput
  title: SearchableStringFilterInput
  identifier: SearchableStringFilterInput
  description: SearchableStringFilterInput
  tags: SearchableStringFilterInput
  creator: SearchableStringFilterInput
  source: SearchableStringFilterInput
  circa: SearchableStringFilterInput
  start_date: SearchableStringFilterInput
  end_date: SearchableStringFilterInput
  rights_statement: SearchableStringFilterInput
  language: SearchableStringFilterInput
  resource_type: SearchableStringFilterInput
  belongs_to: SearchableStringFilterInput
  location: SearchableStringFilterInput
  medium: SearchableStringFilterInput
  bibliographic_citation: SearchableStringFilterInput
  rights_holder: SearchableStringFilterInput
  format: SearchableStringFilterInput
  related_url: SearchableStringFilterInput
  provenance: SearchableStringFilterInput
  repository: SearchableStringFilterInput
  reference: SearchableStringFilterInput
  contributor: SearchableStringFilterInput
  custom_key: SearchableStringFilterInput
  parent_collection: SearchableStringFilterInput
  item_category: SearchableStringFilterInput
  visibility: SearchableBooleanFilterInput
  thumbnail_path: SearchableStringFilterInput
  manifest_url: SearchableStringFilterInput
  create_date: SearchableStringFilterInput
  modified_date: SearchableStringFilterInput
  and: [SearchableArchiveFilterInput]
  or: [SearchableArchiveFilterInput]
  not: SearchableArchiveFilterInput
}

input SearchableArchiveSortInput {
  field: SearchableArchiveSortableFields
  direction: SearchableSortDirection
}

enum SearchableArchiveSortableFields {
  id
  title
  identifier
  description
  tags
  creator
  source
  circa
  start_date
  end_date
  rights_statement
  language
  resource_type
  belongs_to
  location
  medium
  bibliographic_citation
  rights_holder
  format
  related_url
  provenance
  repository
  reference
  contributor
  custom_key
  parent_collection
  item_category
  visibility
  thumbnail_path
  manifest_url
  create_date
  modified_date
}

input SearchableIDFilterInput {
  ne: ID
  gt: ID
  lt: ID
  gte: ID
  lte: ID
  eq: ID
  match: ID
  matchPhrase: ID
  matchPhrasePrefix: ID
  multiMatch: ID
  exists: Boolean
  wildcard: ID
  regexp: ID
}

enum SearchableSortDirection {
  asc
  desc
}

input SearchableStringFilterInput {
  ne: String
  gt: String
  lt: String
  gte: String
  lte: String
  eq: String
  match: String
  matchPhrase: String
  matchPhrasePrefix: String
  multiMatch: String
  exists: Boolean
  wildcard: String
  regexp: String
}
```