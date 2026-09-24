export const SEGMENT_LABELS: Record<string, string> = {
  south_asian_diaspora: "South Asian / Pakistani Diaspora",
  afghan_central_asian_diaspora: "Afghan & Central Asian Diaspora",
  middle_eastern_turkish: "Middle Eastern & Turkish",
  mainstream_german: "Mainstream German Consumer",
  food_service_horeca: "Food Service & HORECA (B2B)",
  private_label_b2b: "Private Label & B2B Retail (B2B)",
};

// Apollo.io only has B2B company/contact data, so ICPs (which drive the
// automated Apollo lead-search) are restricted to these two segments.
export const B2B_SEGMENT_LABELS: Record<string, string> = {
  food_service_horeca: SEGMENT_LABELS.food_service_horeca,
  private_label_b2b: SEGMENT_LABELS.private_label_b2b,
};

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  meeting: "Meeting",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

// Semantic accent per status, used for the status pill/dropdown in the
// leads table — brand charcoal/gold stays primary everywhere else.
export const STATUS_COLORS: Record<string, string> = {
  new: "bg-brand-neutral text-brand-charcoal",
  contacted: "bg-brand-gold/20 text-brand-gold-dark",
  meeting: "bg-sky-100 text-sky-700",
  qualified: "bg-emerald-100 text-emerald-700",
  won: "bg-emerald-600 text-white",
  lost: "bg-red-100 text-red-700",
};

export const SOURCE_LABELS: Record<string, string> = {
  apollo: "Apollo",
  manual: "Manual",
  contact_form: "Contact Form",
};

// Contact-form leads don't collect a segment — the admin triages them
// manually, so the UI needs a label for the "not yet set" state.
export function segmentLabel(segment: string | null): string {
  if (!segment) return "Unclassified — needs triage";
  return SEGMENT_LABELS[segment] ?? segment;
}
