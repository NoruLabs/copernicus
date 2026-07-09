import { useQuery } from "@tanstack/react-query";

export function useExoplanets(filter: string) {
  return useQuery({
    queryKey: ["exoplanets", filter],
    queryFn: async () => {
      const res = await fetch(`/api/exoplanets?filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch exoplanets");
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
