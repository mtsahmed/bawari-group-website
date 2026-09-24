"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SEGMENT_LABELS, SOURCE_LABELS, STATUS_LABELS, segmentLabel } from "@/lib/labels";
import AddLeadForm from "./AddLeadForm";

type Lead = {
  id: string;
  companyName: string;
  contactName: string | null;
  segment: string | null;
  status: string;
  source: string;
  email: string | null;
  createdAt: string;
};

const PAGE_SIZE = 20;

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [segment, setSegment] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page) });
      if (segment) params.set("segment", segment);
      if (status) params.set("status", status);
      if (source) params.set("source", source);
      if (q) params.set("q", q);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        if (!cancelled) {
          setLeads(data.leads);
          setTotal(data.total);
        }
      }
      if (!cancelled) setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [page, segment, status, source, q, refreshToken]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
          Leads
        </h1>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark"
        >
          {showAddForm ? "Close" : "Add Lead"}
        </button>
      </div>

      {showAddForm && (
        <AddLeadForm
          onCreated={() => {
            setShowAddForm(false);
            setPage(1);
            setRefreshToken((t) => t + 1);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search company or contact…"
          className="rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        />
        <select
          value={segment}
          onChange={(e) => {
            setPage(1);
            setSegment(e.target.value);
          }}
          className="rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        >
          <option value="">All segments</option>
          {Object.entries(SEGMENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={source}
          onChange={(e) => {
            setPage(1);
            setSource(e.target.value);
          }}
          className="rounded-md border border-brand-charcoal/20 px-3 py-2 text-sm"
        >
          <option value="">All sources</option>
          {Object.entries(SOURCE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-brand-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-charcoal/10 text-xs uppercase tracking-wide text-brand-charcoal/60">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Segment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-brand-charcoal/50">
                  No leads found.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer border-b border-brand-charcoal/5 last:border-0 hover:bg-brand-neutral"
              >
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="block">
                    <p className="font-medium text-brand-charcoal">
                      {lead.companyName}
                    </p>
                    {lead.contactName && (
                      <p className="text-xs text-brand-charcoal/60">
                        {lead.contactName}
                      </p>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-charcoal/80">
                  {segmentLabel(lead.segment)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-neutral px-2.5 py-1 text-xs font-medium text-brand-charcoal">
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-charcoal/80">
                  {SOURCE_LABELS[lead.source] ?? lead.source}
                  {lead.source === "apollo" && (
                    <span className="ml-2 rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs text-brand-gold-dark">
                      needs review
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-charcoal/80">
                  {lead.email ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-brand-charcoal/70">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
