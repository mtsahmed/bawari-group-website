"use client";

import { useState } from "react";
import { SOURCE_LABELS } from "@/lib/labels";

// Categorical slots for lead source, in fixed enum order. Validated with the
// dataviz palette checker against white (all-pairs CVD ΔE ≥ 13.9). Gold sits
// below 3:1 on white, so every chart using it also shows values as text.
export const SOURCE_COLORS: Record<string, string> = {
  apollo: "#c99a50",
  manual: "#2a78d6",
  contact_form: "#b8636f",
};
const SOURCES = Object.keys(SOURCE_COLORS);

function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-brand-charcoal/10 bg-white p-5 ${className}`}
    >
      <h2 className="text-sm font-semibold text-brand-charcoal">{title}</h2>
      {subtitle && (
        <p className="mt-0.5 text-xs text-brand-charcoal/50">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Legend({ totals }: { totals: Record<string, number> }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-charcoal/70">
      {SOURCES.map((source) => (
        <li key={source} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: SOURCE_COLORS[source] }}
          />
          {SOURCE_LABELS[source]}
          <span className="font-semibold text-brand-charcoal">
            {totals[source] ?? 0}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Leads added per week, stacked by source.

export type WeeklyBucket = {
  weekStart: string; // ISO date, Monday
  counts: Record<string, number>;
};

export function LeadsOverTimeChart({ weeks }: { weeks: WeeklyBucket[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const totals = weeks.map((week) =>
    SOURCES.reduce((sum, s) => sum + (week.counts[s] ?? 0), 0),
  );
  const sourceTotals = Object.fromEntries(
    SOURCES.map((s) => [s, weeks.reduce((sum, w) => sum + (w.counts[s] ?? 0), 0)]),
  );
  const rawMax = Math.max(...totals, 1);
  // Round the y-axis top up to a clean tick.
  const step = rawMax <= 4 ? 1 : rawMax <= 10 ? 2 : Math.ceil(rawMax / 4 / 5) * 5;
  const max = Math.ceil(rawMax / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
  const formatWeek = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <Card
      title="New leads per week"
      subtitle="Last 12 weeks, by source"
      className="lg:col-span-2"
    >
      <Legend totals={sourceTotals} />
      <div className="relative mt-4 flex h-52 pl-7">
        {/* Gridlines + y ticks */}
        <div className="pointer-events-none absolute inset-0 left-7">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 border-t border-[#e1e0d9]"
              style={{ bottom: `${(tick / max) * 100}%` }}
            >
              <span className="absolute -left-7 -translate-y-1/2 text-[10px] tabular-nums text-[#898781]">
                {tick}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex flex-1 items-end">
          {weeks.map((week, i) => (
            <div
              key={week.weekStart}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`relative flex h-full flex-1 flex-col items-center justify-end ${
                hover === i ? "bg-brand-neutral/70" : ""
              }`}
            >
              <div className="flex w-full max-w-6 flex-col-reverse gap-[2px]">
                {SOURCES.map((source) => {
                  const value = week.counts[source] ?? 0;
                  if (!value) return null;
                  return (
                    <div
                      key={source}
                      className="w-full last:rounded-t-[4px]"
                      style={{
                        height: `calc(${(value / max) * 13}rem - 2px)`,
                        minHeight: 2,
                        backgroundColor: SOURCE_COLORS[source],
                      }}
                    />
                  );
                })}
              </div>
              {hover === i && (
                <div
                  className={`absolute bottom-full z-10 mb-1 w-40 ${
                    i < 2 ? "left-0" : i >= weeks.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2"
                  } rounded-md border border-brand-charcoal/10 bg-white p-2.5 text-xs shadow-lg`}
                >
                  <p className="font-semibold text-brand-charcoal">
                    Week of {formatWeek(week.weekStart)}
                  </p>
                  {SOURCES.map((source) => (
                    <p
                      key={source}
                      className="mt-1 flex items-center justify-between gap-2 text-brand-charcoal/70"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-sm"
                          style={{ backgroundColor: SOURCE_COLORS[source] }}
                        />
                        {SOURCE_LABELS[source]}
                      </span>
                      <span className="tabular-nums text-brand-charcoal">
                        {week.counts[source] ?? 0}
                      </span>
                    </p>
                  ))}
                  <p className="mt-1.5 flex justify-between border-t border-brand-charcoal/10 pt-1.5 font-medium text-brand-charcoal">
                    Total <span className="tabular-nums">{totals[i]}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex pl-7 text-[10px] text-[#898781]">
        {weeks.map((week, i) => (
          <span key={week.weekStart} className="flex-1 text-center">
            {i % 2 === 0 ? formatWeek(week.weekStart) : ""}
          </span>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Source mix donut.

export function SourceDonut({ counts }: { counts: Record<string, number> }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = SOURCES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // 2px surface gap between slices, measured along the arc.
  const gap = total > 0 && SOURCES.filter((s) => counts[s]).length > 1 ? 2 : 0;

  const slices = SOURCES.reduce<
    { source: string; value: number; length: number; offset: number }[]
  >((acc, source) => {
    const value = counts[source] ?? 0;
    const length = total ? (value / total) * circumference : 0;
    const prev = acc.at(-1);
    const offset = prev ? prev.offset + prev.length : 0;
    return [...acc, { source, value, length, offset }];
  }, []);

  const hovered = hover ? slices.find((s) => s.source === hover) : null;

  return (
    <Card title="Lead sources" subtitle="Where all leads came from">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f3f2ee"
              strokeWidth="22"
            />
            {slices.map(
              (slice) =>
                slice.value > 0 && (
                  <circle
                    key={slice.source}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={SOURCE_COLORS[slice.source]}
                    strokeWidth={hover === slice.source ? 26 : 22}
                    strokeDasharray={`${Math.max(slice.length - gap, 0.5)} ${circumference}`}
                    strokeDashoffset={-slice.offset}
                    onMouseEnter={() => setHover(slice.source)}
                    onMouseLeave={() => setHover(null)}
                    className="cursor-pointer transition-[stroke-width]"
                  />
                ),
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-brand-charcoal">
              {hovered ? hovered.value : total}
            </p>
            <p className="text-xs text-brand-charcoal/50">
              {hovered
                ? `${SOURCE_LABELS[hovered.source]} · ${Math.round((hovered.value / total) * 100)}%`
                : "total leads"}
            </p>
          </div>
        </div>
        <ul className="w-full space-y-1.5 text-xs">
          {slices.map((slice) => (
            <li
              key={slice.source}
              onMouseEnter={() => setHover(slice.source)}
              onMouseLeave={() => setHover(null)}
              className="flex items-center justify-between text-brand-charcoal/70"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: SOURCE_COLORS[slice.source] }}
                />
                {SOURCE_LABELS[slice.source]}
              </span>
              <span className="tabular-nums">
                <span className="font-semibold text-brand-charcoal">
                  {slice.value}
                </span>{" "}
                · {total ? Math.round((slice.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Horizontal bar list — used for pipeline stages and segments.

export type BarRow = { key: string; label: string; value: number; muted?: boolean };

export function BarList({
  title,
  subtitle,
  rows,
  color,
}: {
  title: string;
  subtitle?: string;
  rows: BarRow[];
  color: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  return (
    <Card title={title} subtitle={subtitle}>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.key}
            title={`${row.label}: ${row.value} (${total ? Math.round((row.value / total) * 100) : 0}%)`}
            className="group"
          >
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span
                className={`truncate ${row.muted ? "text-brand-charcoal/50" : "text-brand-charcoal/80"}`}
              >
                {row.label}
              </span>
              <span className="shrink-0 tabular-nums font-semibold text-brand-charcoal">
                {row.value}
              </span>
            </div>
            <div className="mt-1 h-2.5 rounded-r-[4px] bg-brand-neutral">
              <div
                className="h-full rounded-r-[4px] transition-opacity group-hover:opacity-80"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  backgroundColor: row.muted ? "#c3c2b7" : color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
