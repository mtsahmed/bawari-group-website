"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SOURCE_LABELS, STATUS_LABELS, segmentLabel } from "@/lib/labels";

export type BoardLead = {
  id: string;
  companyName: string;
  contactName: string | null;
  segment: string | null;
  source: string;
  status: string;
  createdAt: string;
};

// Top border accent per column — mirrors STATUS_COLORS in the leads table.
const COLUMN_ACCENTS: Record<string, string> = {
  new: "border-t-brand-charcoal/30",
  contacted: "border-t-brand-gold",
  meeting: "border-t-sky-500",
  qualified: "border-t-emerald-500",
  won: "border-t-emerald-700",
  lost: "border-t-red-400",
};

function relativeAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d`;
  if (days < 60) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

export default function PipelineBoard({ leads }: { leads: BoardLead[] }) {
  const router = useRouter();
  const [items, setItems] = useState(leads);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moveLead(id: string, newStatus: string) {
    const lead = items.find((item) => item.id === id);
    if (!lead || lead.status === newStatus) return;
    const previous = lead.status;

    setError(null);
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );

    // The activity endpoint both logs the note and updates the lead's
    // status, so board moves show up in the lead's history.
    const response = await fetch(`/api/admin/leads/${id}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: `Moved from ${STATUS_LABELS[previous]} to ${STATUS_LABELS[newStatus]} on the pipeline board`,
        statusAtTime: newStatus,
      }),
    });

    if (!response.ok) {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: previous } : item,
        ),
      );
      setError(`Couldn't move ${lead.companyName} — please try again.`);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const columnLeads = items.filter((item) => item.status === status);
          const isOver = overColumn === status && dragId !== null;
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(status);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setOverColumn(null);
                setDragId(null);
                if (id) moveLead(id, status);
              }}
              className={`flex w-60 shrink-0 flex-col rounded-lg border border-t-4 border-brand-charcoal/10 transition-colors ${COLUMN_ACCENTS[status]} ${
                isOver ? "bg-brand-gold/10" : "bg-white/60"
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                <p className="text-sm font-semibold text-brand-charcoal">
                  {label}
                </p>
                <span className="rounded-full bg-brand-neutral px-2 py-0.5 text-xs font-medium text-brand-charcoal/70">
                  {columnLeads.length}
                </span>
              </div>
              <ul className="flex max-h-[28rem] min-h-24 flex-col gap-2 overflow-y-auto px-2 pb-2">
                {columnLeads.length === 0 && (
                  <li className="rounded-md border border-dashed border-brand-charcoal/15 px-3 py-4 text-center text-xs text-brand-charcoal/40">
                    Drop leads here
                  </li>
                )}
                {columnLeads.map((lead) => (
                  <li
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", lead.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDragId(lead.id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverColumn(null);
                    }}
                    className={`group cursor-grab rounded-md border border-brand-charcoal/10 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
                      dragId === lead.id ? "opacity-40" : ""
                    }`}
                  >
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="block text-sm font-medium text-brand-charcoal hover:text-brand-gold-dark"
                    >
                      {lead.companyName}
                    </Link>
                    {lead.contactName && (
                      <p className="mt-0.5 truncate text-xs text-brand-charcoal/60">
                        {lead.contactName}
                      </p>
                    )}
                    <p
                      className={`mt-2 truncate text-xs ${
                        lead.segment
                          ? "text-brand-charcoal/70"
                          : "font-medium text-brand-magenta-gold-dark"
                      }`}
                    >
                      {segmentLabel(lead.segment)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs text-brand-charcoal/50">
                        {SOURCE_LABELS[lead.source] ?? lead.source} ·{" "}
                        {relativeAge(lead.createdAt)}
                      </p>
                      {/* Touch screens can't use HTML5 drag-and-drop, and
                          keyboard users need a non-drag path too. */}
                      <select
                        aria-label={`Move ${lead.companyName} to another stage`}
                        value={lead.status}
                        onChange={(e) => moveLead(lead.id, e.target.value)}
                        className="rounded border border-brand-charcoal/15 bg-white px-1 py-0.5 text-xs text-brand-charcoal/70 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                      >
                        {Object.entries(STATUS_LABELS).map(([key, name]) => (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
