import {
  ApolloQueryResult,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  QueryResult,
} from "@apollo/client";

export const retryQuery = async <
  T extends DocumentNode,
  V extends OperationVariables | LazyQueryHookOptions,
>(
  queryFn: () => Promise<QueryResult<T, V> | ApolloQueryResult<T>>, 
  retries: number, 
  delayMs: number, 
): Promise<QueryResult<T, V> | ApolloQueryResult<T>> => {
  let attempt = 0;

  const retry = async (): Promise<QueryResult<T, V> | ApolloQueryResult<T>> => {
    try {
      return await queryFn(); 
    } catch (error) {
      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs)); 
        return retry(); 
      } else {
        throw error; 
      }
    }
  };

  return retry(); 
};
