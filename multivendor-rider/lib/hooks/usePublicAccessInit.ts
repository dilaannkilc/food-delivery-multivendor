import { useEffect } from "react";
import useEnvVars from "../../environment";
import { fetchPublicAccessToken } from "../utils/service/publicAccessService";


export const usePublicAccessInit = () => {
  const { GRAPHQL_URL } = useEnvVars();

  useEffect(() => {
    const initPublicAccess = async () => {
      try {
        await fetchPublicAccessToken(
          GRAPHQL_URL || "https://aws-server.enatega.com/graphql"
        );
        console.log("✅ Public authentication initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize public access:", error);
      }
    };

    initPublicAccess();
  }, [GRAPHQL_URL]);
};