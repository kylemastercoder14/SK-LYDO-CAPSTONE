import z from "zod";
import {
  budgetReportSchema,
  cbydpReportSchema,
  meetingAgendaSchema,
  meetingMinutesSchema,
  projectProposalSchema,
  projectReportSchema,
  eventSchema,
  budgetDistributionSchema,
  resolutionSchema,
} from "@/validators";

export type ProjectReportFormValues = z.infer<typeof projectReportSchema>;
export type BudgetReportFormValues = z.infer<typeof budgetReportSchema>;
export type ProjectProposalFormValues = z.infer<typeof projectProposalSchema>;
export type CBYDPReportFormValues = z.infer<typeof cbydpReportSchema>;
export type MeetingAgendaFormValues = z.infer<typeof meetingAgendaSchema>;
export type MinutesMeetingFormValues = z.infer<typeof meetingMinutesSchema>;
export type ResolutionFormValues = z.infer<typeof resolutionSchema>;
export type EventFormValues = z.infer<typeof eventSchema>;
export type BudgetDistributionFormValues = z.infer<
  typeof budgetDistributionSchema
>;

export type Trend = "up" | "down" | "stable";

export type ProposalData = {
  createdAt: Date;
  status: string;
};

export type DailyCounts = {
  approved: number;
  rejected: number;
};

export type ChartDataPoint = {
  date: string;
  approved: number;
  rejected: number;
};
