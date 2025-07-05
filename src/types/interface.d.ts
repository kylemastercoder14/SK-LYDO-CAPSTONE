import { SystemLogs, User } from "@prisma/client";

export interface SystemLogsProps extends SystemLogs {
  user: User | null;
}
