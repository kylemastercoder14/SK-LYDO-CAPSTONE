import {
  BudgetReports,
  CBYDP,
  MeetingAgenda,
  ProjectProposal,
  ProjectReports,
  SystemLogs,
  MeetingMinutes,
  User,
} from "@prisma/client";

export interface SystemLogsProps extends SystemLogs {
  user: User | null;
}

export interface ProjectReportsProps extends ProjectReports {
  user: User | null;
}

export interface BudgetReportsProps extends BudgetReports {
  user: User | null;
}

export interface ProjectProposalProps extends ProjectProposal {
  user: User | null;
}

export interface CBYDPProps extends CBYDP {
  user: User | null;
}

export interface MeetingAgendaProps extends MeetingAgenda {
  user: User | null;
}

export interface MinutesMeetingProps extends MeetingMinutes {
  user: User | null;
}
