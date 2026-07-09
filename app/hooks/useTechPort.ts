"use client";

import { useQuery } from "@tanstack/react-query";

export interface TechPortProject {
  id: number;
  projectId?: number;
  title: string;
  description: string;
  statusDescription?: string;
  status?: string;
  benefits?: string;
  imageUrl?: string;
  trlCurrent?: number;
  trlEnd?: number;
  principalInvestigators?: string[];
  leadOrganization: {
    name?: string;
    organization_name?: string;
  };
}

export function useTechPort() {
  return useQuery({
    queryKey: ["techport"],
    queryFn: async () => {
      const res = await fetch("/api/techport");
      if (!res.ok) throw new Error("Failed to fetch TechPort projects");
      const data = await res.json();
      // Empty array means NASA feed isn't ready yet — throw so React Query retries
      if (Array.isArray(data) && data.length === 0) {
        throw new Error("TechPort feed not ready");
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
    retry: true,
    retryDelay: 1000 * 30,
  });
}
