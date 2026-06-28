"use client";

import { useEffect, useRef, useCallback } from "react";
import type { NotificationDTO, SSEEventType } from "@/types";

interface UseNotificationStreamOptions {
  onNotification?: (notification: NotificationDTO) => void;
  onCampaignProgress?: (data: unknown) => void;
  onLeadScoreChange?: (data: unknown) => void;
  enabled?: boolean;
}

export function useNotificationStream({
  onNotification,
  onCampaignProgress,
  onLeadScoreChange,
  enabled = true,
}: UseNotificationStreamOptions) {
  const sourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;
    if (sourceRef.current?.readyState === EventSource.OPEN) return;

    // Clean up existing connection
    sourceRef.current?.close();

    const es = new EventSource("/api/v1/stream");
    sourceRef.current = es;

    es.addEventListener("notification", (e: MessageEvent) => {
      try {
        const notification = JSON.parse(e.data) as NotificationDTO;
        onNotification?.(notification);
      } catch {}
    });

    es.addEventListener("campaign_progress", (e: MessageEvent) => {
      try {
        onCampaignProgress?.(JSON.parse(e.data));
      } catch {}
    });

    es.addEventListener("lead_score_change", (e: MessageEvent) => {
      try {
        onLeadScoreChange?.(JSON.parse(e.data));
      } catch {}
    });

    es.addEventListener("heartbeat", () => {
      // Connection is alive, reset reconnect counter
      reconnectAttempts.current = 0;
    });

    es.onerror = () => {
      es.close();
      sourceRef.current = null;

      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
        reconnectAttempts.current++;
        reconnectTimerRef.current = setTimeout(connect, delay);
      }
    };
  }, [enabled, onNotification, onCampaignProgress, onLeadScoreChange]);

  useEffect(() => {
    connect();
    return () => {
      sourceRef.current?.close();
      sourceRef.current = null;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [connect]);

  return {
    disconnect: () => {
      sourceRef.current?.close();
      sourceRef.current = null;
    },
  };
}
