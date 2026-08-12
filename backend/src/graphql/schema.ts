export const typeDefs = `
  enum NodeType {
    KANJI
    SUB_JUKUGO
    JUKUGO
  }

  interface SemanticNode {
    id: ID!
    word: String!
    meaning: String
    reading: String
    nodeType: NodeType!
  }

  type KanjiNode implements SemanticNode {
    id: ID!
    word: String!
    meaning: String
    reading: String
    nodeType: NodeType!
    onyomi: String
    kunyomi: String
    bushuu: String
    romaji: String
  }

  type SubJukugoNode implements SemanticNode {
    id: ID!
    word: String!
    meaning: String
    reading: String
    nodeType: NodeType!
    constituents: [KanjiNode!]!
  }

  type JukugoNode implements SemanticNode {
    id: ID!
    word: String!
    meaning: String
    reading: String
    nodeType: NodeType!
    formulaPattern: String
    explanation: String
    component1: SemanticNode
    component2: SemanticNode
    subJukugo1: SubJukugoNode
    subJukugo2: SubJukugoNode
    kanjiCards: [KanjiNode!]!
  }

  type GraphEdge {
    id: ID!
    source: String!
    target: String!
    predicate: String
    isCrossLink: Boolean
  }

  type DynamicGraphNode {
    id: ID!
    kanji: String!
    label: String!
    subLabel: String
    meaning: String
    type: String!
    color: String
    borderColor: String
    isPill: Boolean
  }

  type SemanticGraphResponse {
    targetKanji: KanjiNode
    nodes: [DynamicGraphNode!]!
    edges: [GraphEdge!]!
    breakdownTree: [JukugoNode!]!
  }

  type Query {
    getKanjiSemanticGraph(character: String!): SemanticGraphResponse
  }
`;
