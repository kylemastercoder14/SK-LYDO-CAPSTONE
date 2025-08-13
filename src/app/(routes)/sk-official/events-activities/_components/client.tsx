import { Events } from "@prisma/client";
import React from "react";
import Empty from "@/components/globals/empty";

const Client = ({ data }: { data: Events[] }) => {
  return (
    <div>
      {data.length === 0 ? (
        <div className="flex h-screen items-center flex-col justify-center">
          <Empty />
          <h3 className="text-lg font-medium mb-2">No events found.</h3>
          <p className="text-muted-foreground">
            Please check back later for updates.
          </p>
        </div>
      ) : (
        <ul>
          {data.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Client;
