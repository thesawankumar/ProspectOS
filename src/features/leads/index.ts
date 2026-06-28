// Features — Leads
// Centralized types, hooks, and API client actions for the leads feature.

export type { LeadDTO, CreateLeadRequest, LeadFilterParams } from "@/types";

// ── API Client Actions ────────────────────────────────────────────────────────

export async function fetchLeads(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`/api/v1/leads?${qs}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch leads");
  return (await res.json()).data;
}

export async function fetchLead(id: string) {
  const res = await fetch(`/api/v1/leads/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch lead");
  return (await res.json()).data;
}

export async function createLead(data: Record<string, unknown>) {
  const res = await fetch("/api/v1/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Failed to create lead");
  return (await res.json()).data;
}

export async function updateLead(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/v1/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return (await res.json()).data;
}

export async function deleteLead(id: string) {
  const res = await fetch(`/api/v1/leads/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete lead");
}

// ── Email Discovery ───────────────────────────────────────────────────────────

export async function discoverEmails(params: {
  domain?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}) {
  const res = await fetch("/api/v1/email/discover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Email discovery failed");
  return (await res.json()).data;
}

export async function validateEmail(email: string) {
  const res = await fetch("/api/v1/email/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Email validation failed");
  return (await res.json()).data;
}
