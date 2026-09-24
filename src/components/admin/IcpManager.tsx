"use client";

import { useEffect, useState } from "react";
import { B2B_SEGMENT_LABELS } from "@/lib/labels";
import IcpForm, { type IcpFormValues } from "./IcpForm";
import FindLeadsButton from "./FindLeadsButton";

type Icp = {
  id: string;
  name: string;
  segment: string;
  keywords: string[];
  location: string | null;
  employeeRangeMin: number | null;
  employeeRangeMax: number | null;
  notes: string | null;
};

export default function IcpManager() {
  const [icps, setIcps] = useState<Icp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      const res = await fetch("/api/admin/icp");
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        if (!cancelled) setIcps(data.icps);
      }
      if (!cancelled) setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this ICP?")) return;
    await fetch(`/api/admin/icp/${id}`, { method: "DELETE" });
    setRefreshToken((t) => t + 1);
  }

  function toFormValues(icp: Icp): IcpFormValues {
    return {
      id: icp.id,
      name: icp.name,
      segment: icp.segment,
      keywords: icp.keywords,
      location: icp.location ?? "",
      employeeRangeMin: icp.employeeRangeMin,
      employeeRangeMax: icp.employeeRangeMax,
      notes: icp.notes ?? "",
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold text-brand-charcoal">
          Ideal Customer Profiles
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowCreateForm((v) => !v);
          }}
          className="rounded-md bg-brand-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-gold-dark"
        >
          {showCreateForm ? "Close" : "New ICP"}
        </button>
      </div>

      {showCreateForm && (
        <IcpForm
          onSaved={() => {
            setShowCreateForm(false);
            setRefreshToken((t) => t + 1);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="space-y-3">
        {!loading && icps.length === 0 && (
          <p className="rounded-lg border border-brand-charcoal/10 bg-white p-6 text-sm text-brand-charcoal/50">
            No ICPs yet. Create one to start sourcing B2B leads.
          </p>
        )}
        {icps.map((icp) =>
          editingId === icp.id ? (
            <IcpForm
              key={icp.id}
              initialValues={toFormValues(icp)}
              onSaved={() => {
                setEditingId(null);
                setRefreshToken((t) => t + 1);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={icp.id}
              className="rounded-lg border border-brand-charcoal/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-brand-charcoal">{icp.name}</p>
                  <p className="mt-1 text-sm text-brand-charcoal/60">
                    {B2B_SEGMENT_LABELS[icp.segment] ?? icp.segment}
                    {icp.location ? ` · ${icp.location}` : ""}
                  </p>
                  {icp.keywords.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {icp.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full bg-brand-neutral px-2.5 py-1 text-xs text-brand-charcoal"
                        >
                          {k}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingId(icp.id);
                    }}
                    className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 text-sm text-brand-charcoal"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(icp.id)}
                    className="rounded-md border border-brand-charcoal/20 px-3 py-1.5 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 border-t border-brand-charcoal/10 pt-4">
                <FindLeadsButton
                  icpId={icp.id}
                  onDone={() => setRefreshToken((t) => t + 1)}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
