// Features — Campaigns
export type { CampaignDTO, CreateCampaignRequest } from "@/types";

export async function fetchCampaigns(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`/api/v1/campaigns?${qs}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return (await res.json()).data;
}

export async function createCampaign(data: Record<string, unknown>) {
  const res = await fetch("/api/v1/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Failed to create campaign");
  return (await res.json()).data;
}

export async function updateCampaignStatus(id: string, status: string) {
  const res = await fetch(`/api/v1/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update campaign");
  return (await res.json()).data;
}
