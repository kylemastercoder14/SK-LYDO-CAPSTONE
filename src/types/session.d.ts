import { ROLE_CONFIG } from "@/lib/config";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: keyof typeof ROLE_CONFIG;
  createdAt: string;
}
