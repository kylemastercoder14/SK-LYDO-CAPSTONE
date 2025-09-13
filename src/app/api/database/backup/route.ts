/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { backupTables } from "@/lib/constants";
import db from "@/lib/db";

export async function GET() {
  const supabase = createClient();
  const fileName = `backup_${new Date().toISOString()}.json`;

  try {
    const backup: Record<string, any[]> = {};

    for (const table of backupTables) {
      const { data, error } = await (await supabase).from(table).select("*");
      if (error) throw error;
      backup[table] = data || [];
    }

    await db.backupHistory.create({
      data: {
        action: "backup",
        filename: fileName,
        status: "success",
      },
    });

    return NextResponse.json(backup, {
      headers: {
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    });
  } catch (error: any) {
    await db.backupHistory.create({
      data: {
        action: "backup",
        filename: fileName,
        status: "failed",
      },
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
