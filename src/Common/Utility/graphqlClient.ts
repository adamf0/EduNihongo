const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

export async function fetchGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP GraphQL error! status: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message || "GraphQL Query Error");
  }

  return json.data as T;
}

export const GET_KANJI_SEMANTIC_GRAPH_QUERY = `
  query GetKanjiSemanticGraph($character: String!) {
    getKanjiSemanticGraph(character: $character) {
      targetKanji {
        id
        word
        meaning
        reading
        nodeType
        onyomi
        kunyomi
        bushuu
        romaji
      }
      nodes {
        id
        kanji
        label
        subLabel
        meaning
        type
        color
        borderColor
        isPill
      }
      edges {
        id
        source
        target
        predicate
        isCrossLink
      }
      breakdownTree {
        id
        word
        meaning
        reading
        nodeType
        formulaPattern
        explanation
        component1 {
          ... on KanjiNode {
            id
            word
            meaning
            reading
            nodeType
          }
          ... on SubJukugoNode {
            id
            word
            meaning
            reading
            nodeType
          }
        }
        component2 {
          ... on KanjiNode {
            id
            word
            meaning
            reading
            nodeType
          }
          ... on SubJukugoNode {
            id
            word
            meaning
            reading
            nodeType
          }
        }
        subJukugo1 {
          id
          word
          meaning
          nodeType
        }
        subJukugo2 {
          id
          word
          meaning
          nodeType
        }
        kanjiCards {
          id
          word
          meaning
          reading
          onyomi
          kunyomi
          romaji
        }
      }
    }
  }
`;
