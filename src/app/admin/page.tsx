"use client";

import { useEffect, useState } from "react";
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
  services: string[];
  logo_url: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await getSupabase()
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      setSubmissions((data as Submission[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function loadFull(id: string) {
    const { data } = await getSupabase()
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();
    setSelected(data as Record<string, unknown>);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Client Submissions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {submissions.length} total submission{submissions.length !== 1 && "s"}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {submissions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No submissions yet. Share your intake form link with clients!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions list */}
            <div className="lg:col-span-1 space-y-3">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => loadFull(sub.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    selected && (selected as Record<string, unknown>).id === sub.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {sub.agency_name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.status === "new"
                          ? "bg-green-100 text-green-700"
                          : sub.status === "building"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {sub.address_city}, {sub.address_state} &middot;{" "}
                    {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>

            {/* Detail view */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-[family-name:var(--font-heading)] text-xl text-gray-900">
                        {selected.agency_name as string}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Submitted{" "}
                        {new Date(
                          selected.created_at as string
                        ).toLocaleString()}
                      </p>
                    </div>
                    {typeof selected.logo_url === "string" && selected.logo_url && (
                      <img
                        src={selected.logo_url}
                        alt="Logo"
                        className="h-12 w-auto"
                      />
                    )}
                  </div>

                  {/* Render all fields */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(selected).map(([key, value]) => {
                      if (
                        key === "id" ||
                        key === "created_at" ||
                        !value ||
                        (typeof value === "string" && !value.trim())
                      )
                        return null;
                      return (
                        <div
                          key={key}
                          className={`${
                            typeof value === "object" ? "col-span-2" : ""
                          }`}
                        >
                          <span className="text-gray-400 text-xs uppercase tracking-wide">
                            {key.replace(/_/g, " ")}
                          </span>
                          <div className="text-gray-900 mt-0.5">
                            {typeof value === "object" ? (
                              <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : typeof value === "boolean" ? (
                              value ? "Yes" : "No"
                            ) : typeof value === "string" &&
                              value.startsWith("http") ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {value}
                              </a>
                            ) : (
                              String(value)
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  Select a submission to view details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
