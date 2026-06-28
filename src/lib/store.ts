import { create } from "zustand";

export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  companySize: string;
  linkedin: string;
  leadScore: number;
  stage: "New Lead" | "Contacted" | "Replied" | "Interested" | "Meeting" | "Proposal" | "Negotiation" | "Won" | "Lost";
  tags: string[];
  owner: string;
  notes: string[];
  tasks: { id: string; title: string; dueDate: string; priority: "high" | "medium" | "low"; completed: boolean }[];
  meetings: { id: string; title: string; date: string; time: string; link: string }[];
  timeline: { id: string; type: string; description: string; date: string }[];
}

export interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Draft";
  audienceSize: number;
  sentCount: number;
  openCount: number;
  replyCount: number;
  bounceCount: number;
  dailyLimit: number;
  delaySeconds: number;
  timezone: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  folder: string;
  isFavorite: boolean;
}

export interface Proposal {
  id: string;
  clientName: string;
  company: string;
  services: string;
  pricing: string;
  text: string;
  status: "Draft" | "Sent" | "Accepted";
  date: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export interface Contract {
  id: string;
  clientName: string;
  type: "Freelance" | "Agency" | "Retainer" | "Consulting";
  status: "Active" | "Draft" | "Signed";
  date: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "Active" | "Inactive";
}

export interface WebhookDeliveryLog {
  id: string;
  url: string;
  event: string;
  timestamp: string;
  statusCode: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  folder: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "task" | "sequence";
}

export interface Workspace {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  teamSize?: string;
  role?: string;
  dailyGoal?: number;
  members: { name: string; email: string; role: "Owner" | "Admin" | "Manager" | "Sales" | "Viewer" }[];
  smtpConnected: boolean;
  smtpSettings?: { host: string; email: string; provider: string };
  leads: Lead[];
  activities: { id: string; type: string; title: string; timestamp: string }[];
  campaigns: Campaign[];
  templates: Template[];
  proposals: Proposal[];
  invoices: Invoice[];
  contracts: Contract[];
  webhooks: WebhookEndpoint[];
  webhookLogs: WebhookDeliveryLog[];
  files: DocumentFile[];
  calendarEvents: CalendarEvent[];
}

interface UserSession {
  name: string;
  email: string;
  avatar: string;
  role: string;
  twoFactorEnabled: boolean;
  activeDevices: { id: string; device: string; ip: string; location: string; active: boolean }[];
}

interface FeatureFlags {
  aiAgent: boolean;
  proposals: boolean;
  contracts: boolean;
  invoices: boolean;
  webhooks: boolean;
}

interface ProspectStore {
  session: UserSession;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  notifications: { id: string; title: string; message: string; read: boolean; type: "success" | "warning" | "info" }[];
  featureFlags: FeatureFlags;
  
  // Actions
  setSession: (session: Partial<UserSession>) => void;
  addWorkspace: (workspace: Omit<Workspace, "leads" | "activities" | "campaigns" | "templates" | "proposals" | "invoices" | "contracts" | "webhooks" | "webhookLogs" | "files" | "calendarEvents">) => void;
  switchWorkspace: (id: string) => void;
  inviteMember: (workspaceId: string, member: Workspace["members"][0]) => void;
  connectSMTP: (workspaceId: string, settings: Workspace["smtpSettings"]) => void;
  disconnectSMTP: (workspaceId: string) => void;
  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  
  // Lead Actions
  addLead: (lead: Omit<Lead, "id" | "timeline" | "notes" | "tasks" | "meetings" | "leadScore">) => { success: boolean; isDuplicate: boolean; lead: Lead | null };
  updateLeadStage: (leadId: string, stage: Lead["stage"]) => void;
  deleteLead: (leadId: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  addLeadTask: (leadId: string, task: Omit<Lead["tasks"][0], "id" | "completed">) => void;
  toggleLeadTask: (leadId: string, taskId: string) => void;
  scheduleLeadMeeting: (leadId: string, meeting: Omit<Lead["meetings"][0], "id">) => void;
  
  // Campaign Actions
  addCampaign: (campaign: Omit<Campaign, "id" | "sentCount" | "openCount" | "replyCount" | "bounceCount">) => void;
  toggleCampaignStatus: (campaignId: string) => void;
  deleteCampaign: (campaignId: string) => void;
  
  // Template Actions
  addTemplate: (template: Omit<Template, "id" | "isFavorite">) => void;
  toggleTemplateFavorite: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;

  // Billing Actions
  addProposal: (proposal: Omit<Proposal, "id" | "status" | "date">) => void;
  addInvoice: (invoice: Omit<Invoice, "id" | "status">) => void;
  addContract: (contract: Omit<Contract, "id" | "status" | "date">) => void;
  
  // Webhooks Actions
  addWebhookEndpoint: (webhook: Omit<WebhookEndpoint, "id" | "status">) => void;
  testWebhookEndpoint: (endpointId: string) => void;
  deleteWebhookEndpoint: (endpointId: string) => void;

  // File Actions
  addFile: (file: Omit<DocumentFile, "id" | "date">) => void;
  deleteFile: (fileId: string) => void;

  // Calendar Actions
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  
  // Notification Actions
  addNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
}

const initialTemplates: Template[] = [
  {
    id: "temp-1",
    name: "Cold Pitch — Startup Hook",
    subject: "Quick question about {{company}} team",
    body: "Hi {{first_name}},\n\nI loved your recent updates on {{website}}! I noticed your team in {{city}} is scaling up development.\n\nAre you currently looking to expand outreach velocity to win more clients in the {{industry}} space?\n\nBest,\n{{sender_name}}",
    folder: "Cold Outreach",
    isFavorite: true
  },
  {
    id: "temp-2",
    name: "Followup — Share Value",
    subject: "Re: Quick question about {{company}} team",
    body: "Hi {{first_name}},\n\nJust checking if you had a moment to review my last suggestion on {{pain_point}}.\n\nI've prepared a brief audit of your domain conversion metrics. Would you be open to a 5-minute call this Thursday?\n\nBest,\n{{sender_name}}",
    folder: "Follow-ups",
    isFavorite: false
  }
];

const initialCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Series B Founders Outreach",
    status: "Active",
    audienceSize: 250,
    sentCount: 1420,
    openCount: 971,
    replyCount: 173,
    bounceCount: 2,
    dailyLimit: 50,
    delaySeconds: 15,
    timezone: "UTC-5 (EST)"
  },
  {
    id: "camp-2",
    name: "Agency Retainer Pitch",
    status: "Draft",
    audienceSize: 42,
    sentCount: 0,
    openCount: 0,
    replyCount: 0,
    bounceCount: 0,
    dailyLimit: 20,
    delaySeconds: 30,
    timezone: "UTC+0 (GMT)"
  }
];

const mockLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Sarah Jenkins",
    role: "Head of Marketing",
    company: "Figma",
    email: "sarah@figma.com",
    phone: "+1 (555) 019-2834",
    website: "figma.com",
    location: "San Francisco, CA",
    industry: "Design Software",
    companySize: "1,000-5,000",
    linkedin: "linkedin.com/in/sarah-jenkins",
    leadScore: 92,
    stage: "Replied",
    tags: ["Hot", "Enterprise"],
    owner: "Alex Rivera",
    notes: ["Spoke briefly at Config. Highly interested in team integrations."],
    tasks: [
      { id: "task-1-1", title: "Send team onboarding brief", dueDate: "2026-06-30", priority: "high", completed: false }
    ],
    meetings: [
      { id: "meet-1-1", title: "Config follow-up call", date: "2026-07-02", time: "11:00 AM", link: "https://meet.google.com/abc-xyz" }
    ],
    timeline: [
      { id: "time-1-1", type: "lead_created", description: "Lead discovered via B2B search index.", date: "2026-06-28 10:10" },
      { id: "time-1-2", type: "email_sent", description: "Campaign Introduction Sent (AI generated context).", date: "2026-06-28 11:30" },
      { id: "time-1-3", type: "email_replied", description: "Replied: 'Hey! Loved your launch. Let's talk.'", date: "2026-06-28 14:02" },
    ]
  },
  {
    id: "lead-2",
    name: "David Chen",
    role: "VP of Sales",
    company: "Linear",
    email: "david@linear.app",
    phone: "+1 (555) 021-9876",
    website: "linear.app",
    location: "New York, NY",
    industry: "Project Management",
    companySize: "50-250",
    linkedin: "linkedin.com/in/davidchen",
    leadScore: 88,
    stage: "Meeting",
    tags: ["Warm", "SaaS"],
    owner: "Alex Rivera",
    notes: ["Interested in API triggers for task conversions."],
    tasks: [],
    meetings: [],
    timeline: [
      { id: "time-2-1", type: "lead_created", description: "Lead imported from list setup.", date: "2026-06-28 10:12" },
    ]
  },
  {
    id: "lead-3",
    name: "Amanda Ross",
    role: "Co-Founder",
    company: "Raycast",
    email: "amanda@raycast.com",
    phone: "+1 (555) 043-1122",
    website: "raycast.com",
    location: "London, UK",
    industry: "Developer Utilities",
    companySize: "10-50",
    linkedin: "linkedin.com/in/amandaross",
    leadScore: 95,
    stage: "Won",
    tags: ["VIP", "High Value"],
    owner: "Alex Rivera",
    notes: ["Completed annual contract signature. Team onboarding next week."],
    tasks: [],
    meetings: [],
    timeline: [
      { id: "time-3-1", type: "lead_created", description: "Lead parsed via domain search.", date: "2026-06-28 09:00" },
      { id: "time-3-2", type: "deal_won", description: "Contract Signed ($5,000/mo).", date: "2026-06-28 15:30" }
    ]
  }
];

const initialProposals: Proposal[] = [
  { id: "prop-1", clientName: "Sarah Jenkins", company: "Figma", services: "Outreach & Pacing integration", pricing: "$4,500/mo", text: "AI generated proposal text for Figma scaling project...", status: "Accepted", date: "2026-06-28" }
];

const initialInvoices: Invoice[] = [
  { id: "inv-1", invoiceNumber: "INV-2026-001", clientName: "Amanda Ross (Raycast)", amount: 5000, status: "Paid", dueDate: "2026-07-15" },
  { id: "inv-2", invoiceNumber: "INV-2026-002", clientName: "David Chen (Linear)", amount: 2000, status: "Pending", dueDate: "2026-07-28" }
];

const initialContracts: Contract[] = [
  { id: "con-1", clientName: "Amanda Ross (Raycast)", type: "Retainer", status: "Signed", date: "2026-06-28" }
];

const initialFiles: DocumentFile[] = [
  { id: "file-1", name: "Figma_Outreach_Audit.pdf", size: "1.4 MB", type: "pdf", folder: "Audits", date: "2026-06-28" },
  { id: "file-2", name: "Linear_API_Notes.docx", size: "420 KB", type: "docx", folder: "Client Files", date: "2026-06-28" }
];

const initialCalendarEvents: CalendarEvent[] = [
  { id: "cal-1", title: "Figma Follow-up call", date: "2026-07-02", type: "meeting" },
  { id: "cal-2", title: "Verify dental scraping logs", date: "2026-06-30", type: "task" },
  { id: "cal-3", title: "Series B Campaign Pacing Outbox", date: "2026-07-04", type: "sequence" }
];

export const useProspectStore = create<ProspectStore>((set, get) => ({
  session: {
    name: "Alex Rivera",
    email: "alex@velstudio.com",
    avatar: "AR",
    role: "Founder",
    twoFactorEnabled: false,
    activeDevices: [
      { id: "dev-1", device: "Chrome / Linux (Ubuntu)", ip: "192.168.1.45", location: "Mumbai, India", active: true },
      { id: "dev-2", device: "Safari / Apple iPhone 15", ip: "102.24.12.98", location: "Mumbai, India", active: false }
    ]
  },
  featureFlags: {
    aiAgent: true,
    proposals: true,
    contracts: true,
    invoices: true,
    webhooks: true
  },
  workspaces: [
    {
      id: "velstudio",
      name: "VelStudio",
      website: "velstudio.com",
      industry: "Design Agency",
      teamSize: "2-10",
      role: "Agency",
      dailyGoal: 50,
      smtpConnected: true,
      smtpSettings: { host: "smtp.gmail.com", email: "outreach@velstudio.com", provider: "Gmail" },
      members: [
        { name: "Alex Rivera", email: "alex@velstudio.com", role: "Owner" },
        { name: "John Doe", email: "john@velstudio.com", role: "Admin" },
        { name: "Jane Smith", email: "jane@velstudio.com", role: "Sales" }
      ],
      leads: mockLeads,
      campaigns: initialCampaigns,
      templates: initialTemplates,
      proposals: initialProposals,
      invoices: initialInvoices,
      contracts: initialContracts,
      webhooks: [
        { id: "web-1", url: "https://api.velstudio.com/v1/prospect-sync", events: ["lead_created", "email_replied"], status: "Active" }
      ],
      webhookLogs: [
        { id: "log-1", url: "https://api.velstudio.com/v1/prospect-sync", event: "email_replied", timestamp: "2026-06-28 14:02", statusCode: 200 }
      ],
      files: initialFiles,
      calendarEvents: initialCalendarEvents,
      activities: [
        { id: "act-1", type: "lead_won", title: "Amanda Ross (Raycast) contract signed", timestamp: "1 hour ago" },
        { id: "act-2", type: "email_replied", title: "Sarah Jenkins (Figma) replied to sequence", timestamp: "3 hours ago" },
        { id: "act-3", type: "meeting_booked", title: "Meeting scheduled with David Chen", timestamp: "5 hours ago" }
      ]
    },
    {
      id: "personal",
      name: "Personal Freelancing",
      dailyGoal: 20,
      smtpConnected: false,
      members: [
        { name: "Alex Rivera", email: "alex@velstudio.com", role: "Owner" }
      ],
      leads: [
        {
          id: "lead-p1",
          name: "Tim Cook",
          role: "Creative Director",
          company: "Studio 8",
          email: "tim@studio8.design",
          phone: "",
          website: "studio8.design",
          location: "Austin, TX",
          industry: "Architecture",
          companySize: "1-10",
          linkedin: "",
          leadScore: 78,
          stage: "New Lead",
          tags: ["Local", "Design"],
          owner: "Alex Rivera",
          notes: [],
          tasks: [],
          meetings: [],
          timeline: []
        }
      ],
      campaigns: [],
      templates: [],
      proposals: [],
      invoices: [],
      contracts: [],
      webhooks: [],
      webhookLogs: [],
      files: [],
      calendarEvents: [],
      activities: [
        { id: "act-p1", type: "lead_created", title: "Tim Cook added to pipeline", timestamp: "Yesterday" }
      ]
    }
  ],
  activeWorkspaceId: "velstudio",
  notifications: [
    { id: "not-1", title: "New Reply", message: "Sarah Jenkins replied to your campaign.", read: false, type: "success" },
    { id: "not-2", title: "Meeting Scheduled", message: "David Chen booked a call via Google Meet.", read: false, type: "info" }
  ],

  setSession: (newSession) => set((state) => ({ session: { ...state.session, ...newSession } })),

  addWorkspace: (workspace) => set((state) => ({
    workspaces: [
      ...state.workspaces,
      {
        ...workspace,
        leads: [],
        campaigns: [],
        templates: initialTemplates,
        proposals: [],
        invoices: [],
        contracts: [],
        webhooks: [],
        webhookLogs: [],
        files: [],
        calendarEvents: [],
        activities: [{ id: Math.random().toString(), type: "system", title: `Workspace ${workspace.name} created.`, timestamp: "Just now" }]
      }
    ],
    activeWorkspaceId: workspace.id
  })),

  switchWorkspace: (id) => set({ activeWorkspaceId: id }),

  inviteMember: (workspaceId, member) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === workspaceId ? { ...w, members: [...w.members, member] } : w
    )
  })),

  connectSMTP: (workspaceId, settings) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === workspaceId
        ? {
            ...w,
            smtpConnected: true,
            smtpSettings: settings,
            activities: [
              ...w.activities,
              { id: Math.random().toString(), type: "smtp_connected", title: `SMTP Connected (${settings?.email})`, timestamp: "Just now" }
            ]
          }
        : w
    )
  })),

  disconnectSMTP: (workspaceId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === workspaceId
        ? {
            ...w,
            smtpConnected: false,
            smtpSettings: undefined,
            activities: [
              ...w.activities,
              { id: Math.random().toString(), type: "smtp_disconnected", title: "SMTP Disconnected", timestamp: "Just now" }
            ]
          }
        : w
    )
  })),

  toggleFeatureFlag: (flag) => set((state) => ({
    featureFlags: { ...state.featureFlags, [flag]: !state.featureFlags[flag] }
  })),

  addLead: (leadData) => {
    const { workspaces, activeWorkspaceId } = get();
    const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
    if (!workspace) return { success: false, isDuplicate: false, lead: null };

    const isDuplicate = workspace.leads.some(
      (l) =>
        (leadData.email && l.email.toLowerCase() === leadData.email.toLowerCase()) ||
        (leadData.website && l.website.toLowerCase() === leadData.website.toLowerCase())
    );

    if (isDuplicate) {
      return { success: false, isDuplicate: true, lead: null };
    }

    let score = 50 + Math.floor(Math.random() * 25);
    if (leadData.role.toLowerCase().includes("founder") || leadData.role.toLowerCase().includes("cto") || leadData.role.toLowerCase().includes("vp")) {
      score += 15;
    }
    if (leadData.companySize.includes("50") || leadData.companySize.includes("1,000")) {
      score += 10;
    }
    score = Math.min(score, 100);

    const newLead: Lead = {
      ...leadData,
      id: `lead-${Math.random().toString(36).substring(2, 9)}`,
      leadScore: score,
      notes: [],
      tasks: [],
      meetings: [],
      timeline: [
        { id: Math.random().toString(), type: "lead_created", description: "Lead initialized inside workspace CRM.", date: new Date().toISOString().slice(0,16).replace('T', ' ') }
      ]
    };

    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === activeWorkspaceId
          ? {
              ...w,
              leads: [newLead, ...w.leads],
              activities: [
                { id: Math.random().toString(), type: "lead_created", title: `Lead ${leadData.name} discovered`, timestamp: "Just now" },
                ...w.activities
              ]
            }
          : w
      )
    }));

    return { success: true, isDuplicate: false, lead: newLead };
  },

  updateLeadStage: (leadId, stage) => set((state) => {
    const activeId = state.activeWorkspaceId;
    return {
      workspaces: state.workspaces.map((w) => {
        if (w.id !== activeId) return w;
        
        const lead = w.leads.find((l) => l.id === leadId);
        if (!lead) return w;

        const timelineEntry = {
          id: Math.random().toString(),
          type: "stage_change",
          description: `Stage shifted from ${lead.stage} to ${stage}`,
          date: new Date().toISOString().slice(0, 16).replace("T", " ")
        };

        const updatedLeads = w.leads.map((l) =>
          l.id === leadId ? { ...l, stage, timeline: [timelineEntry, ...l.timeline] } : l
        );

        let activeTitle = `Lead ${lead.name} moved to ${stage}`;
        if (stage === "Won") activeTitle = `Closed client Won! 🎉 ${lead.company}`;

        return {
          ...w,
          leads: updatedLeads,
          activities: [
            { id: Math.random().toString(), type: stage === "Won" ? "lead_won" : "stage_shift", title: activeTitle, timestamp: "Just now" },
            ...w.activities
          ]
        };
      })
    };
  }),

  deleteLead: (leadId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            leads: w.leads.filter((l) => l.id !== leadId)
          }
        : w
    )
  })),

  addLeadNote: (leadId, note) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            leads: w.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    notes: [note, ...l.notes],
                    timeline: [
                      {
                        id: Math.random().toString(),
                        type: "note_added",
                        description: `Note added: "${note.substring(0, 30)}..."`,
                        date: new Date().toISOString().slice(0, 16).replace("T", " ")
                      },
                      ...l.timeline
                    ]
                  }
                : l
            )
          }
        : w
    )
  })),

  addLeadTask: (leadId, task) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            leads: w.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    tasks: [...l.tasks, { ...task, id: Math.random().toString(), completed: false }],
                    timeline: [
                      {
                        id: Math.random().toString(),
                        type: "task_added",
                        description: `Task created: "${task.title}"`,
                        date: new Date().toISOString().slice(0, 16).replace("T", " ")
                      },
                      ...l.timeline
                    ]
                  }
                : l
            )
          }
        : w
    )
  })),

  toggleLeadTask: (leadId, taskId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            leads: w.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    tasks: l.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
                  }
                : l
            )
          }
        : w
    )
  })),

  scheduleLeadMeeting: (leadId, meeting) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            leads: w.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    meetings: [...l.meetings, { ...meeting, id: Math.random().toString() }],
                    timeline: [
                      {
                        id: Math.random().toString(),
                        type: "meeting_scheduled",
                        description: `Meeting scheduled: "${meeting.title}" on ${meeting.date} at ${meeting.time}`,
                        date: new Date().toISOString().slice(0, 16).replace("T", " ")
                      },
                      ...l.timeline
                    ]
                  }
                : l
            )
          }
        : w
    )
  })),

  addCampaign: (campData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            campaigns: [
              ...w.campaigns,
              {
                ...campData,
                id: `camp-${Math.random().toString(36).substring(2, 9)}`,
                sentCount: 0,
                openCount: 0,
                replyCount: 0,
                bounceCount: 0
              }
            ],
            activities: [
              { id: Math.random().toString(), type: "campaign_created", title: `Campaign "${campData.name}" created`, timestamp: "Just now" },
              ...w.activities
            ]
          }
        : w
    )
  })),

  toggleCampaignStatus: (campaignId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            campaigns: w.campaigns.map((c) =>
              c.id === campaignId
                ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
                : c
            )
          }
        : w
    )
  })),

  deleteCampaign: (campaignId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            campaigns: w.campaigns.filter((c) => c.id !== campaignId)
          }
        : w
    )
  })),

  addTemplate: (tempData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            templates: [
              ...w.templates,
              {
                ...tempData,
                id: `temp-${Math.random().toString(36).substring(2, 9)}`,
                isFavorite: false
              }
            ]
          }
        : w
    )
  })),

  toggleTemplateFavorite: (templateId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            templates: w.templates.map((t) =>
              t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
            )
          }
        : w
    )
  })),

  duplicateTemplate: (templateId) => set((state) => {
    const activeW = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    if (!activeW) return {};
    const template = activeW.templates.find(t => t.id === templateId);
    if (!template) return {};

    const copy = {
      ...template,
      id: `temp-${Math.random().toString(36).substring(2, 9)}`,
      name: `${template.name} (Copy)`
    };

    return {
      workspaces: state.workspaces.map((w) =>
        w.id === state.activeWorkspaceId
          ? { ...w, templates: [...w.templates, copy] }
          : w
      )
    };
  }),

  deleteTemplate: (templateId) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            templates: w.templates.filter((t) => t.id !== templateId)
          }
        : w
    )
  })),

  // Billing Actions
  addProposal: (propData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            proposals: [
              ...w.proposals,
              {
                ...propData,
                id: `prop-${Math.random().toString(36).substring(2, 9)}`,
                status: "Draft",
                date: new Date().toISOString().slice(0, 10)
              }
            ]
          }
        : w
    )
  })),

  addInvoice: (invData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            invoices: [
              ...w.invoices,
              {
                ...invData,
                id: `inv-${Math.random().toString(36).substring(2, 9)}`,
                status: "Pending"
              }
            ]
          }
        : w
    )
  })),

  addContract: (conData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            contracts: [
              ...w.contracts,
              {
                ...conData,
                id: `con-${Math.random().toString(36).substring(2, 9)}`,
                status: "Draft",
                date: new Date().toISOString().slice(0, 10)
              }
            ]
          }
        : w
    )
  })),

  // Webhooks
  addWebhookEndpoint: (webData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            webhooks: [
              ...w.webhooks,
              {
                ...webData,
                id: `web-${Math.random().toString(36).substring(2, 9)}`,
                status: "Active"
              }
            ]
          }
        : w
    )
  })),

  testWebhookEndpoint: (id) => set((state) => ({
    workspaces: state.workspaces.map((w) => {
      if (w.id !== state.activeWorkspaceId) return w;
      const target = w.webhooks.find(web => web.id === id);
      if (!target) return w;
      return {
        ...w,
        webhookLogs: [
          {
            id: `wlog-${Math.random().toString(36).substring(2, 9)}`,
            url: target.url,
            event: target.events[0] || "test_event",
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
            statusCode: 200
          },
          ...w.webhookLogs
        ]
      };
    })
  })),

  deleteWebhookEndpoint: (id) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            webhooks: w.webhooks.filter((web) => web.id !== id)
          }
        : w
    )
  })),

  // Document Files
  addFile: (fileData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            files: [
              ...w.files,
              {
                ...fileData,
                id: `file-${Math.random().toString(36).substring(2, 9)}`,
                date: new Date().toISOString().slice(0, 10)
              }
            ]
          }
        : w
    )
  })),

  deleteFile: (id) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            files: w.files.filter((f) => f.id !== id)
          }
        : w
    )
  })),

  // Calendar
  addCalendarEvent: (eventData) => set((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId
        ? {
            ...w,
            calendarEvents: [
              ...w.calendarEvents,
              {
                ...eventData,
                id: `cal-${Math.random().toString(36).substring(2, 9)}`
              }
            ]
          }
        : w
    )
  })),

  addNotification: (title, message, type) => set((state) => ({
    notifications: [{ id: Math.random().toString(), title, message, read: false, type }, ...state.notifications]
  })),

  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  clearNotifications: () => set({ notifications: [] })
}));
