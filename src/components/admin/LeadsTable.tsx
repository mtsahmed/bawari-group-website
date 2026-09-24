"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  SEGMENT_LABELS,
  SOURCE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  segmentLabel,
} from "@/lib/labels";
import AddLeadForm from "./AddLeadForm";

type Lead = {
  id: string;
  companyName: string;
  contactName: string | null;
  segment: string | null;
  status: string;
  source: string;
  email: string | null;
  website: string | null;
  linkedinUrl: string | null;
  notes: string | null;
  createdAt: string;
};

const PAGE_SIZE = 20;

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M8.5 4.5H4.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4M11.5 3h5.5v5.5M16.5 3.5 9 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M5.5 7.5H3V17h2.5V7.5ZM4.25 6.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 11.6c0-2.8-1.5-4.1-3.5-4.1-1.6 0-2.3.9-2.7 1.5V7.5H8.3c.03.7 0 9.5 0 9.5h2.5v-5.3c0-.3 0-.6.1-.8.25-.6.8-1.3 1.75-1.3 1.24 0 1.74.94 1.74 2.3V17H17v-5.4Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 14v1.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M4 4.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3.5 3v-3H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const [notesOpenId, setNotesOpenId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

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

  function toggleNotes(lead: Lead) {
    if (notesOpenId === lead.id) {
      setNotesOpenId(null);
      return;
    }
    setNotesOpenId(lead.id);
    setNotesDraft(lead.notes ?? "");
  }

  async function saveNotes(leadId: string) {
    setSavingNotes(true);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notesDraft }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, notes: notesDraft } : l)),
      );
      setNotesOpenId(null);
    }
    setSavingNotes(false);
  }

  async function updateStatus(leadId: string, newStatus: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
    );
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  function exportUrl() {
    const params = new URLSearchParams();
    if (segment) params.set("segment", segment);
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/api/admin/leads/export${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
            Leads
          </h1>
          <p className="mt-0.5 text-sm text-brand-charcoal/60">
            {total} lead{total === 1 ? "" : "s"} found
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={exportUrl()}
            className="flex items-center gap-1.5 rounded-md border border-brand-charcoal/20 px-4 py-2 text-sm font-medium text-brand-charcoal transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark"
          >
            <DownloadIcon />
            Export CSV
          </a>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark"
          >
            {showAddForm ? "Close" : "Add Lead"}
          </button>
        </div>
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
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-brand-charcoal/50">
                  No leads found.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <Fragment key={lead.id}>
                <tr className="border-b border-brand-charcoal/5 last:border-0 hover:bg-brand-neutral">
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
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${
                        STATUS_COLORS[lead.status] ?? "bg-brand-neutral text-brand-charcoal"
                      }`}
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-brand-charcoal/60">
                      {lead.website ? (
                        <a
                          href={withProtocol(lead.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open website"
                          className="rounded p-1.5 transition-colors hover:bg-brand-neutral hover:text-brand-charcoal"
                        >
                          <ExternalLinkIcon />
                        </a>
                      ) : (
                        <span className="rounded p-1.5 opacity-30" title="No website on file">
                          <ExternalLinkIcon />
                        </span>
                      )}
                      {lead.linkedinUrl ? (
                        <a
                          href={withProtocol(lead.linkedinUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open LinkedIn"
                          className="rounded p-1.5 transition-colors hover:bg-brand-neutral hover:text-brand-charcoal"
                        >
                          <LinkedinIcon />
                        </a>
                      ) : (
                        <span className="rounded p-1.5 opacity-30" title="No LinkedIn on file">
                          <LinkedinIcon />
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleNotes(lead)}
                        title={lead.notes ? lead.notes : "Add a note"}
                        className={`rounded p-1.5 transition-colors hover:bg-brand-neutral hover:text-brand-charcoal ${
                          notesOpenId === lead.id ? "bg-brand-neutral text-brand-charcoal" : ""
                        } ${lead.notes ? "text-brand-gold-dark" : ""}`}
                      >
                        <NoteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
                {notesOpenId === lead.id && (
                  <tr className="border-b border-brand-charcoal/5 bg-brand-neutral/40 last:border-0">
                    <td colSpan={6} className="px-4 py-3">
                      <textarea
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        rows={2}
                        autoFocus
                        placeholder="Add a note about this lead…"
                        className="w-full rounded-md border border-brand-charcoal/20 bg-white px-3 py-2 text-sm"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveNotes(lead.id)}
                          disabled={savingNotes}
                          className="rounded-md bg-brand-charcoal px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-60"
                        >
                          {savingNotes ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotesOpenId(null)}
                          className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 text-xs font-medium text-brand-charcoal"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
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
