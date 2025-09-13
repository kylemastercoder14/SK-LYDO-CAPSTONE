/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { backupTables } from "@/lib/constants";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const fileName = `restore_${new Date().toISOString()}.json`;

  try {
    const body = await req.json();

    // restore each table in proper order
    for (const table of backupTables) {
      const rows = body[table];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      // use UPSERT to avoid duplicate key errors
      const { error } = await (await supabase)
        .from(table)
        .upsert(rows as any[], { onConflict: "id" }); // assumes "id" is the PK

      if (error) throw error;
    }

    // log history (success)
    await db.backupHistory.create({
      data: {
        action: "restore",
        filename: fileName,
        status: "success",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // log history (failed)
    await db.backupHistory.create({
      data: {
        action: "restore",
        filename: fileName,
        status: "failed",
      },
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
