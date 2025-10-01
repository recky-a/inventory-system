// components/charts/transactions.tsx
"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const chartConfig = {
  qty: {
    label: "Jumlah Barang",
    color: "var(--chart-1)",
  },
  revenue: {
    label: "Total Transaksi (Rp)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type RawRow = { date: string; qty: number | string; revenue: number | string };
type NormalizedRow = { date: string; qty: number; revenue: number };

export function ChartLineInteractive({ chartData }: { chartData: RawRow[] }) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("qty");

  // Normalize incoming data on client in case any values are strings
  const data = React.useMemo<NormalizedRow[]>(
    () =>
      (chartData || []).map((r) => ({
        date: String(r.date),
        qty: Number(r.qty ?? 0),
        revenue: Number(r.revenue ?? 0),
      })),
    [chartData]
  );

  const totals = React.useMemo(
    () => ({
      qty: data.reduce((acc, cur) => acc + (cur.qty ?? 0), 0),
      revenue: data.reduce((acc, cur) => acc + (cur.revenue ?? 0), 0),
    }),
    [data]
  );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Statistik Transaksi Harian</CardTitle>
          <CardDescription>
            Menampilkan jumlah barang terjual dan nilai transaksi per hari
          </CardDescription>
        </div>

        <div className="flex">
          {(["qty", "revenue"] as (keyof typeof chartConfig)[]).map((k) => (
            <button
              key={k}
              data-active={activeChart === k}
              onClick={() => setActiveChart(k)}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[k].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {k === "revenue"
                  ? `Rp ${totals.revenue.toLocaleString("id-ID")}`
                  : totals.qty.toLocaleString("id-ID")}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {/* IMPORTANT: ChartContainer must have a min-h or h for responsive charts */}
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 14, bottom: 6 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(String(value)).toLocaleDateString("id-ID", { month: "short", day: "numeric" })
              }
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) =>
                activeChart === "revenue" ? `Rp ${Number(val).toLocaleString("id-ID")}` : Number(val).toLocaleString("id-ID")
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  // labelFormatter: format the date shown in the tooltip header
                  labelFormatter={(value: any) =>
                    new Date(String(value)).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }
                  // formatter: format the metric values per series
                  formatter={(value: any) =>
                    activeChart === "revenue"
                      ? `Rp ${Number(value).toLocaleString("id-ID")}`
                      : Number(value).toLocaleString("id-ID")
                  }
                  nameKey={chartConfig[activeChart].label as string}
                />
              }
            />

            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

