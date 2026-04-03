import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { loadConfig } from "../config";
import { useInternetIdentity } from "./useInternetIdentity";

async function maybeCreateActor(
  identity?: import("@icp-sdk/core/agent").Identity,
): Promise<backendInterface | null> {
  const config = await loadConfig();
  // No canister on Vercel — skip actor creation entirely
  if (!config.backend_canister_id) return null;
  const { createActorWithConfig } = await import("../createActorWithConfig");
  return createActorWithConfig(
    identity ? { agentOptions: { identity } } : undefined,
  );
}

const ACTOR_QUERY_KEY = "actor";
export function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery<backendInterface | null>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: () => maybeCreateActor(identity),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
  });
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (q) => !q.queryKey.includes(ACTOR_QUERY_KEY),
      });
      queryClient.refetchQueries({
        predicate: (q) => !q.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);
  return { actor: actorQuery.data ?? null, isFetching: actorQuery.isFetching };
}
