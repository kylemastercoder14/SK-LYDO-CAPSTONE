"use client";

import { useEffect, useState, useRef } from "react";
import { formatDistanceToNowStrict } from "date-fns";

interface Status {
  lastActiveAt: Date | null;
  statusText: string;
  isOnline: boolean;
}

const UPDATE_ACTIVITY_URL = `/api/user/update-activity`;
const GET_LAST_ACTIVE_URL = `/api/user/last-active`;

const useActiveStatus = (userId: string | null) => {
  const [status, setStatus] = useState<Status>({
    lastActiveAt: null,
    statusText: "Offline",
    isOnline: false,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced activity update to prevent too many calls
  const updateActivity = async () => {
    if (!userId) return;

    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Debounce the activity update
    activityTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(UPDATE_ACTIVITY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          console.error("Failed to update activity:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to update user activity:", error);
      }
    }, 1000); // Debounce by 1 second
  };

  const fetchStatus = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${GET_LAST_ACTIVE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user status: ${response.statusText}`);
      }

      const data = await response.json();
      const lastActiveTimestamp = data.lastActiveAt;

      if (lastActiveTimestamp) {
        const lastActiveDate = new Date(lastActiveTimestamp);
        const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);

        const isOnline = lastActiveDate > fiveMinutesAgo;
        const statusText = isOnline
          ? "Online"
          : `Active ${formatDistanceToNowStrict(lastActiveDate, {
              addSuffix: true,
            })}`;

        setStatus({
          lastActiveAt: lastActiveDate,
          statusText,
          isOnline,
        });
      } else {
        setStatus({
          lastActiveAt: null,
          statusText: "Offline",
          isOnline: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
      setStatus({
        lastActiveAt: null,
        statusText: "Offline",
        isOnline: false,
      });
    }
  };

  useEffect(() => {
    if (!userId) {
      setStatus({ lastActiveAt: null, statusText: "Offline", isOnline: false });
      return;
    }

    // Initial fetch
    fetchStatus();

    // Set up activity listeners with throttling
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "click",
    ];

    let lastActivityTime = 0;
    const throttleDelay = 5000; // 5 seconds

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > throttleDelay) {
        lastActivityTime = now;
        updateActivity();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Set up interval to fetch status
    intervalRef.current = setInterval(fetchStatus, 30000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return status;
};

export default useActiveStatus;
