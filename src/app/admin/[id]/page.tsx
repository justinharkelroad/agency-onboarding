"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import TemplatePicker from "@/components/admin/TemplatePicker";
import ConfigGenerator from "@/components/admin/ConfigGenerator";
import PhotoChecklist from "@/components/admin/PhotoChecklist";

interface AgencyData {
  id: string;
  created_at: string;
  agency_name: string;
  tagline: string;
  phone: string;
  email: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  office_hours: string;
  years_in_business: number;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  logo_url: string;
  hero_image_url: string;
  about_text: string;
  highlights: string[];
  services: string[];
  carriers: string;
  team_members: Array<{
    name: string;
    title: string;
    bio: string;
    photo_url: string;
  }>;
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_yelp: string;
  google_maps_url: string;
  domain_preferred: string;
  domain_owned: boolean;
  notes: string;
  status: string;
  template: string | null;
  deployed_url: string | null;
  formspree_id: string | null;
  service_areas: string[] | null;
  ga_measurement_id: string | null;
}

const STATUS_OPTIONS = ["new", "reviewing", "building", "live", "paused"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-green-100 text-green-700 border-green-200",
  reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  building: "bg-blue-100 text-blue-700 border-blue-200",
  live: "bg-purple-100 text-purple-700 border-purple-200",
  paused: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function AgencyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [agency, setAgency] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "template" | "deploy" | "photos"
  >("overview");

  useEffect(() => {
    async function load() {
      const { data } = await getSupabase()
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();
      setAgency(data as AgencyData);
      setLoading(false);
    }
    load();
  }, [id]);

  async function updateField(field: string, value: unknown) {
    if (!agency) return;
    setSaving(true);
    const { error } = await getSupabase()
      .from("submissions")
      .update({ [field]: value })
      .eq("id", id);
    if (!error) {
      setAgency({ ...agency, [field]: value } as AgencyData);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading agency...
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Agency not found.{" "}
        <Link href="/admin" className="text-blue-600 ml-2 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "template" as const, label: "Template" },
    { key: "photos" as const, label: "Photos" },
    { key: "deploy" as const, label: "Deploy" },
  ];

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/admin" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">{agency.agency_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {agency.logo_url ? (
                <img
                  src={agency.logo_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-contain bg-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {agency.agency_name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {agency.agency_name}
                </h1>
                <p className="text-gray-500 text-sm">
                  {agency.address_city}, {agency.address_state} ·{" "}
                  {agency.phone} · {agency.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saving && (
                <span className="text-xs text-gray-400">Saving...</span>
              )}
              {/* Status dropdown */}
              <select
                value={agency.status || "new"}
                onChange={(e) => updateField("status", e.target.value)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${
                  STATUS_STYLES[agency.status] || STATUS_STYLES.new
                }`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 -mb-[1px]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab content */}
      <div className="px-8 py-6">
        {activeTab === "overview" && <OverviewTab agency={agency} />}
        {activeTab === "template" && (
          <TemplatePicker
            selected={agency.template}
            onSelect={(template) => updateField("template", template)}
          />
        )}
        {activeTab === "photos" && (
          <PhotoChecklist
            agency={agency}
            template={agency.template || "heritage"}
          />
        )}
        {activeTab === "deploy" && (
          <ConfigGenerator
            agency={agency}
            onUpdateField={updateField}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ agency }: { agency: AgencyData }) {
  const sections = [
    {
      title: "Agency Information",
      fields: [
        ["Agency Name", agency.agency_name],
        ["Tagline", agency.tagline || "—"],
        ["Phone", agency.phone],
        ["Email", agency.email],
        [
          "Address",
          `${agency.address_street}, ${agency.address_city}, ${agency.address_state} ${agency.address_zip}`,
        ],
        ["Office Hours", agency.office_hours || "—"],
        ["Years in Business", agency.years_in_business?.toString() || "—"],
      ],
    },
    {
      title: "Branding",
      fields: [
        ["Primary Color", agency.color_primary],
        ["Secondary Color", agency.color_secondary],
        ["Accent Color", agency.color_accent],
      ],
    },
    {
      title: "Content",
      fields: [
        ["About Text", agency.about_text || "—"],
        [
          "Highlights",
          Array.isArray(agency.highlights)
            ? agency.highlights.join(" · ")
            : "—",
        ],
        [
          "Services",
          Array.isArray(agency.services) ? agency.services.join(", ") : "—",
        ],
        ["Carriers", agency.carriers || "—"],
      ],
    },
    {
      title: "Online Presence",
      fields: [
        ["Facebook", agency.social_facebook || "—"],
        ["Google", agency.social_google || "—"],
        ["Instagram", agency.social_instagram || "—"],
        ["LinkedIn", agency.social_linkedin || "—"],
        ["Yelp", agency.social_yelp || "—"],
        ["Google Maps", agency.google_maps_url || "—"],
      ],
    },
    {
      title: "Domain",
      fields: [
        ["Preferred Domain", agency.domain_preferred || "—"],
        ["Owns Domain", agency.domain_owned ? "Yes" : "No"],
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Team members */}
      {agency.team_members && agency.team_members.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agency.team_members.map((member, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                    {member.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {member.name}
                  </p>
                  <p className="text-gray-500 text-xs">{member.title}</p>
                  {member.bio && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data sections */}
      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map(([label, value]) => (
              <div key={label as string}>
                <span className="text-gray-400 text-xs uppercase tracking-wide">
                  {label}
                </span>
                <div className="text-gray-900 text-sm mt-0.5">
                  {typeof value === "string" && value.startsWith("http") ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className={(value as string)?.length > 100 ? "col-span-2" : ""}>
                      {value as string}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Color swatches */}
          {section.title === "Branding" && (
            <div className="flex gap-3 mt-4">
              {[
                ["Primary", agency.color_primary],
                ["Secondary", agency.color_secondary],
                ["Accent", agency.color_accent],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500 font-mono">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Notes */}
      {agency.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Client Notes</h3>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">
            {agency.notes}
          </p>
        </div>
      )}
    </div>
  );
}
