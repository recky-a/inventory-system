// app/(dashboard)/page.tsx
import { db } from "@/lib/db";
import { ChartLineInteractive } from "./charts/transactions";
import { sql } from "drizzle-orm";

export default async function DashboardPage() {
  const result = await db.execute(sql`
    SELECT
      DATE_TRUNC('day', tgl_transaksi) as date,
      COALESCE(SUM(item_transaksi), 0) as qty,
      COALESCE(SUM(total_transaksi), 0) as revenue
    FROM t_transaksi
    GROUP BY DATE_TRUNC('day', tgl_transaksi)
    ORDER BY date;
  `);

  // Normalize types: Postgres may return numeric as string, date as Date object.
  const chartData = result.rows.map((r: any) => ({
    date: r.date instanceof Date ? r.date.toISOString() : String(r.date),
    qty: Number(r.qty ?? 0),
    revenue: Number(r.revenue ?? 0),
  }));

  return (
    <div className="py-7 px-5">
      <ChartLineInteractive chartData={chartData} />
    </div>
  );
}

