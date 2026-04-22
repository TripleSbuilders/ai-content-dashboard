export type AnalyticsEvent = {
  name: string;
  ts: number;
  wizard_type?: string;
  draft_key?: string;
  step_id?: string;
  step_index?: number;
  total_steps?: number;
  validation_state?: "passed" | "failed";
  elapsed_time_ms?: number;
  kit_id?: string;
  error?: string;
  restored_draft?: boolean;
  experiment_variant?: "A" | "B";
};

export interface AnalyticsStore {
  append(events: AnalyticsEvent[]): void;
  getAll(): AnalyticsEvent[];
}

export class InMemoryAnalyticsStore implements AnalyticsStore {
  private readonly maxEvents: number;
  private readonly events: AnalyticsEvent[] = [];

  constructor(maxEvents = 5000) {
    this.maxEvents = maxEvents;
  }

  append(events: AnalyticsEvent[]): void {
    this.events.push(...events);
    if (this.events.length > this.maxEvents) {
      this.events.splice(0, this.events.length - this.maxEvents);
    }
  }

  getAll(): AnalyticsEvent[] {
    return this.events;
  }
}

