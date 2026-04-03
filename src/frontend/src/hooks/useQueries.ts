import { useQuery } from "@tanstack/react-query";
import type { Category } from "../backend";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProducts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProductById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      try {
        return await actor.getProductsByCategory(category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllTestimonials();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
