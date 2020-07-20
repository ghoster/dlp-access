# Collection data schema
```
type Collection @model {
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
```
# Archive data schema
```
type Archive @model {
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
```