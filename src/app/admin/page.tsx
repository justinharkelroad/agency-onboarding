"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface Submission {
  id: string;
  created_at: string;
  agency_name: string;
  email: string;
  phone: string;
  address_city: string;
  address_state: string;
  status: string;
  template: string | null;
  deployed_url: string | null;
  logo_url: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-green-100 text-green-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  building: "bg-blue-100 text-blue-700",
  live: "bg-purple-100 text-purple-700",
  paused: "bg-gray-100 text-gray-600",
};

const TEMPLATE_LABELS: Record<string, string> = {
  heritage: "Heritage",
  momentum: "Momentum",
  prestige: "Prestige",
  apex: "Apex",
  cornerstone: "Cornerstone",
  summit: "Summit",
  vanguard: "Vanguard",
  forge: "Forge",
  meridian: "Meridian",
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const { data } = await getSupabase()
        .from("submissions")
        .select(
          "id, created_at, agency_name, email, phone, address_city, address_state, status, template, deployed_url, logo_url"
        )
        .order("created_at", { ascending: false });
      setSubmissions((data as Submission[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    new: submissions.filter((s) => s.status === "new").length,
    reviewing: submissions.filter((s) => s.status === "reviewing").length,
    building: submissions.filter((s) => s.status === "building").length,
    live: submissions.filter((s) => s.status === "live").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Agency Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage agency submissions, pick templates, and deploy sites.
          </p>
        </div>
      </header>

      {/* Stats cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {(
            [
              ["all", "Total", "bg-gray-900"],
              ["new", "New", "bg-green-600"],
              ["reviewing", "Reviewing", "bg-yellow-600"],
              ["building", "Building", "bg-blue-600"],
              ["live", "Live", "bg-purple-600"],
            ] as const
          ).map(([key, label, bg]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                filter === key
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${bg}`} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {label}
                </span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Agencies table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
            {filter === "all"
              ? "No submissions yet. Share your onboarding form link with agencies."
              : `No agencies with status "${filter}".`}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {sub.logo_url ? (
                          <img
                            src={sub.logo_url}
                            alt=""
                            className="w-8 h-8 rounded object-contain bg-gray-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                            {sub.agency_name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {sub.agency_name}
                          </p>
                          <p className="text-gray-400 text-xs">{sub.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sub.address_city}, {sub.address_state}
                    </td>
                    <td className="px-6 py-4">
                      {sub.template ? (
                        <span className="text-sm font-medium text-gray-700">
                          {TEMPLATE_LABELS[sub.template] || sub.template}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not selected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          STATUS_STYLES[sub.status] || STATUS_STYLES.new
                        }`}
                      >
                        {sub.status || "new"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/${sub.id}`}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
