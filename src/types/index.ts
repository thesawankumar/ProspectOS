// ─────────────────────────────────────────────────────────────────────────────
// ProspectOS — Centralized TypeScript Types
// Single source of truth for all entities used across API routes,
// services, repositories, and UI components.
// ─────────────────────────────────────────────────────────────────────────────

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── API Response ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: unknown;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type PlanTier = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  plan: PlanTier;
  emailVerified: boolean;
  onboardingDone: boolean;
}

export interface JwtPayload {
  sub: string;       // user id
  wid: string;       // active workspace id
  role: UserRole;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

// ── Workspace ─────────────────────────────────────────────────────────────────

export interface WorkspaceDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  plan: PlanTier;
  memberCount?: number;
  createdAt: string;
}

// ── Lead ──────────────────────────────────────────────────────────────────────

export type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "REPLIED"
  | "INTERESTED"
  | "MEETING"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export interface LeadDTO {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  company?: CompanyDTO | null;
  location?: string | null;
  linkedinUrl?: string | null;
  leadScore: number;
  stage: LeadStage;
  source?: string | null;
  isVerified: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  location?: string;
  linkedinUrl?: string;
  stage?: LeadStage;
  tags?: string[];
}

export interface LeadFilterParams extends PaginationParams {
  stage?: LeadStage;
  search?: string;
  companyId?: string;
  minScore?: number;
  maxScore?: number;
  tags?: string[];
}

// ── Company ───────────────────────────────────────────────────────────────────

export interface CompanyDTO {
  id: string;
  name: string;
  domain?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  score: number;
  leadCount?: number;
  createdAt: string;
}

// ── Campaign ──────────────────────────────────────────────────────────────────

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export interface CampaignDTO {
  id: string;
  name: string;
  description?: string | null;
  status: CampaignStatus;
  fromEmail?: string | null;
  dailyLimit: number;
  leadCount: number;
  sentCount: number;
  openCount: number;
  replyCount: number;
  bounceCount: number;
  openRate: number;
  replyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  fromName?: string;
  fromEmail?: string;
  replyToEmail?: string;
  dailyLimit?: number;
  delayMinutes?: number;
  timezone?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}

// ── Email Template ────────────────────────────────────────────────────────────

export interface TemplateDTO {
  id: string;
  name: string;
  subject: string;
  body: string;
  folder: string;
  variables: string[];
  isFavorite: boolean;
  createdAt: string;
}

// ── Email Discovery ───────────────────────────────────────────────────────────

export type EmailType = "PERSONAL" | "WORK" | "ROLE_BASED" | "GENERIC";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface DiscoveredEmail {
  address: string;
  type: EmailType;
  confidence: number;
  source: string;
  riskLevel: RiskLevel;
  isVerified: boolean;
}

export interface EmailDiscoveryRequest {
  domain?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  linkedinUrl?: string;
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  isDisposable: boolean;
  isCatchAll: boolean;
  mxRecordFound: boolean;
  smtpCheck: boolean;
  riskScore: number;
  confidence: number;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsReplied: number;
  emailsBounced: number;
  meetingsBooked: number;
  leadsAdded: number;
  campaignsActive: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
  deliveryRate: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "REPLY" | "MEETING" | "CAMPAIGN";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

// ── SSE Events ────────────────────────────────────────────────────────────────

export type SSEEventType =
  | "notification"
  | "campaign_progress"
  | "email_reply"
  | "lead_score_change"
  | "heartbeat";

export interface SSEEvent {
  type: SSEEventType;
  data: unknown;
  timestamp: string;
}

// ── AI ─────────────────────────────────────────────────────────────────────────

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIChatRequest {
  message: string;
  context?: Record<string, unknown>;
  history?: AIChatMessage[];
}

export interface AIChatResponse {
  response: string;
  action?: AIChatAction;
  data?: unknown;
}

export interface AIChatAction {
  type: "navigate" | "filter_leads" | "launch_campaign" | "create_proposal" | "show_data";
  payload?: Record<string, unknown>;
}

export interface AIGenerateRequest {
  type: "email" | "proposal" | "followup" | "linkedin";
  context: {
    leadName?: string;
    company?: string;
    services?: string;
    tone?: "formal" | "casual" | "friendly";
    customInstructions?: string;
  };
}

// ── Webhook ───────────────────────────────────────────────────────────────────

export interface WebhookDTO {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastDeliveryAt?: string | null;
  failureCount: number;
  createdAt: string;
}

// ── Command Palette ───────────────────────────────────────────────────────────

export type CommandType = "page" | "lead" | "campaign" | "template" | "action" | "setting";

export interface CommandItem {
  id: string;
  type: CommandType;
  title: string;
  description?: string;
  href?: string;
  icon?: string;
  keywords?: string[];
  action?: () => void;
}

// ── Health Check ──────────────────────────────────────────────────────────────

export interface HealthCheckResponse {
  status: "ok" | "degraded" | "down";
  version: string;
  uptime: number;
  timestamp: string;
  services: {
    database: "ok" | "error";
    cache: "ok" | "error";
    email: "ok" | "error";
  };
}
