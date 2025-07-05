export const ROLE_CONFIG = {
  ADMIN: {
    prefix: "/admin",
    dashboard: "/admin/dashboard",
  },
  SK_OFFICIAL: {
    prefix: "/sk-official",
    dashboard: "/sk-official/dashboard",
  },
  SK_FEDERATION: {
    prefix: "/sk-federation",
    dashboard: "/sk-federation/dashboard",
  },
  LYDO: {
    prefix: "/lydo",
    dashboard: "/lydo/dashboard",
  },
} as const;

export type UserRole = keyof typeof ROLE_CONFIG;
