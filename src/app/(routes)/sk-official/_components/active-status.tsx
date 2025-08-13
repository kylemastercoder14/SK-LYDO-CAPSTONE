"use client";

import useActiveStatus from "@/hooks/use-active-status";

const ActiveStatus = ({ userId }: { userId: string }) => {
  useActiveStatus(userId);
  return null;
};

export default ActiveStatus;
