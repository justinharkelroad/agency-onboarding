"use client";

import { useState } from "react";
import { generateConfigTS, type AgencyData } from "@/lib/generateConfig";

interface ConfigGeneratorProps {
  agency: AgencyData & { id: string; status: string };
  onUpdateField: (field: string, value: unknown) => void;
}

export default function ConfigGenerator({
  agency,
  onUpdateField,
}: ConfigGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [deployState, setDeployState] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");
  const [deployResult, setDeployResult] = useState<{
    url?: string;
    error?: string;
  }>({});
  const [customDomain, setCustomDomain] = useState("");
  const [domainState, setDomainState] = useState<"idle" | "adding" | "success" | "error">("idle");
  const [domainMessage, setDomainMessage] = useState("");

  // Deployment settings fields
  const [formspreeId, setFormspreeId] = useState(agency.formspree_id || "");
  const [serviceAreas, setServiceAreas] = useState(
    (agency.service_areas || []).join(", ")
  );
  const [gaId, setGaId] = useState(agency.ga_measurement_id || "");
  const [googleAdsId, setGoogleAdsId] = useState((agency as any).google_ads_id || "");
  const [googleAdsCallLabel, setGoogleAdsCallLabel] = useState((agency as any).google_ads_call_label || "");
  const [googleAdsFormLabel, setGoogleAdsFormLabel] = useState((agency as any).google_ads_form_label || "");
  const [customHeadScripts, setCustomHeadScripts] = useState((agency as any).custom_head_scripts || "");
  const [customBodyScripts, setCustomBodyScripts] = useState((agency as any).custom_body_scripts || "");
  const [deployedUrl, setDeployedUrl] = useState(agency.deployed_url || "");

  const configOutput = generateConfigTS(agency);

  function handleCopy() {
    navigator.clipboard.writeText(configOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function saveDeploySettings() {
    onUpdateField("formspree_id", formspreeId || null);
    onUpdateField(
      "service_areas",
      serviceAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    onUpdateField("ga_measurement_id", gaId || null);
    onUpdateField("google_ads_id", googleAdsId || null);
    onUpdateField("google_ads_call_label", googleAdsCallLabel || null);
    onUpdateField("google_ads_form_label", googleAdsFormLabel || null);
    onUpdateField("custom_head_scripts", customHeadScripts || null);
    onUpdateField("custom_body_scripts", customBodyScripts || null);
    onUpdateField("deployed_url", deployedUrl || null);
  }

  // Pre-deploy checklist items
  const checklist = [
    {
      check: !!agency.template,
      label: "Template selected",
      detail: agency.template || "Not selected",
    },
    {
      check: !!agency.logo_url,
      label: "Logo uploaded",
      detail: "",
    },
    {
      check: !!agency.hero_image_url,
      label: "Hero image uploaded",
      detail: "",
    },
    {
      check: (agency.team_members || []).some((m) => m.photo_url),
      label: "At least one team photo uploaded",
      detail: "",
    },
    {
      check: true,
      label: "Formspree ID (optional)",
      detail: formspreeId || "Will use placeholder",
    },
    {
      check: !!serviceAreas,
      label: "Service areas defined",
      detail: serviceAreas || "None",
    },
    {
      check: !!agency.domain_preferred,
      label: "Domain configured",
      detail: agency.domain_preferred || "Not set",
    },
  ];

  const allChecked = checklist.every((item) => item.check);

  async function handleDeploy() {
    setDeployState("deploying");
    setDeployResult({});

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: agency.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeployState("error");
        setDeployResult({ error: data.error || "Deployment failed" });
        return;
      }

      setDeployState("success");
      setDeployResult({ url: data.url });
      setDeployedUrl(data.url);
      onUpdateField("status", "live");
      onUpdateField("deployed_url", data.url);
    } catch (err) {
      setDeployState("error");
      setDeployResult({
        error: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  const isLive = agency.status === "live" && agency.deployed_url;

  return (
    <div className="space-y-8">
      {/* Live site banner */}
      {isLive && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Site is Live</h3>
            <a
              href={agency.deployed_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-sm"
            >
              {agency.deployed_url}
            </a>
          </div>
          <button
            onClick={handleDeploy}
            disabled={deployState === "deploying"}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {deployState === "deploying" ? "Redeploying..." : "Redeploy"}
          </button>
        </div>
      )}

      {/* Custom Domain */}
      {agency.vercel_project_id && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Custom Domain</h3>
          <p className="text-gray-500 text-sm mb-4">
            Add a custom domain to this agency&apos;s site. Make sure DNS is pointed to Vercel first
            (A record → 76.76.21.21, CNAME www → cname.vercel-dns.com).
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="www.smithinsurance.com"
              className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={async () => {
                if (!customDomain.trim()) return;
                setDomainState("adding");
                setDomainMessage("");
                try {
                  const res = await fetch("/api/domain", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      projectId: agency.vercel_project_id,
                      domain: customDomain.trim().replace(/^https?:\/\//, ""),
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setDomainState("success");
                    setDomainMessage(`Added ${data.domain}. ${data.verified ? "Verified and active." : "DNS verification pending."}`);
                    onUpdateField("domain_preferred", customDomain.trim());
                  } else {
                    setDomainState("error");
                    setDomainMessage(data.error || "Failed to add domain");
                  }
                } catch {
                  setDomainState("error");
                  setDomainMessage("Network error");
                }
              }}
              disabled={domainState === "adding"}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {domainState === "adding" ? "Adding..." : "Add Domain"}
            </button>
          </div>
          {domainMessage && (
            <div className={`mt-3 text-sm ${domainState === "success" ? "text-green-600" : "text-red-600"}`}>
              {domainMessage}
            </div>
          )}
        </div>
      )}

      {/* Deployment settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Deployment Settings
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Fill these in before deploying. These get saved to the database and
          included in the generated config.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formspree Form ID
            </label>
            <input
              type="text"
              value={formspreeId}
              onChange={(e) => setFormspreeId(e.target.value)}
              placeholder="xyzabcde"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Create one at formspree.io for this agency&apos;s lead form
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GA4 Measurement ID
            </label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Ads ID
            </label>
            <input
              type="text"
              value={googleAdsId}
              onChange={(e) => setGoogleAdsId(e.target.value)}
              placeholder="AW-1234567890"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ads Call Conversion Label
            </label>
            <input
              type="text"
              value={googleAdsCallLabel}
              onChange={(e) => setGoogleAdsCallLabel(e.target.value)}
              placeholder="AbCdEfGhIjKl"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ads Form Conversion Label
            </label>
            <input
              type="text"
              value={googleAdsFormLabel}
              onChange={(e) => setGoogleAdsFormLabel(e.target.value)}
              placeholder="MnOpQrStUvWx"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Head Scripts
            </label>
            <textarea
              value={customHeadScripts}
              onChange={(e) => setCustomHeadScripts(e.target.value)}
              placeholder="Paste tracking scripts here (Metricool, Facebook Pixel, etc.)"
              rows={3}
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Injected into &lt;head&gt;. Use for Metricool, HotJar, etc.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Body Scripts
            </label>
            <textarea
              value={customBodyScripts}
              onChange={(e) => setCustomBodyScripts(e.target.value)}
              placeholder="Paste scripts for end of body (chat widgets, etc.)"
              rows={3}
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Injected before &lt;/body&gt;. Use for chat widgets, Facebook Pixel, etc.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Areas (nearby cities for SEO)
            </label>
            <input
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              placeholder="Dallas, Fort Worth, Plano, Richardson"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Comma-separated. These cities get injected into meta tags, schema,
              and content for local SEO.
            </p>
          </div>

          {deployedUrl && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deployed URL
              </label>
              <input
                type="text"
                value={deployedUrl}
                readOnly
                className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          )}
        </div>

        <button
          onClick={saveDeploySettings}
          className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Save Settings
        </button>
      </div>

      {/* Pre-deploy checklist */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Pre-Deploy Checklist
        </h3>
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                item.check ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.check ? "bg-green-500" : "bg-red-300"
                }`}
              >
                {item.check ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white text-xs">!</span>
                )}
              </div>
              <span className="text-sm text-gray-700 flex-1">
                {item.label}
              </span>
              {item.detail && (
                <span className="text-xs text-gray-400">{item.detail}</span>
              )}
            </div>
          ))}
        </div>

        {/* Approve & Deploy button */}
        {!isLive && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDeploy}
              disabled={!allChecked || deployState === "deploying"}
              className={`w-full py-4 rounded-lg text-lg font-semibold transition-all cursor-pointer ${
                allChecked && deployState !== "deploying"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {deployState === "deploying"
                ? "Deploying... (this takes about 60 seconds)"
                : "Approve & Deploy"}
            </button>

            {!allChecked && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Complete all checklist items above to enable deployment
              </p>
            )}

            {deployState === "success" && deployResult.url && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium">
                  Deployed successfully!
                </p>
                <a
                  href={deployResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-sm"
                >
                  {deployResult.url}
                </a>
              </div>
            )}

            {deployState === "error" && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-medium">Deployment failed</p>
                <p className="text-red-600 text-sm mt-1">
                  {deployResult.error}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generated config */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Generated config.ts</h3>
            <p className="text-gray-500 text-sm mt-1">
              This is auto-deployed when you click Approve & Deploy. You can also
              copy it manually.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {copied ? "Copied!" : "Copy Config"}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px] max-w-full">
          <pre className="text-green-400 text-xs leading-relaxed font-mono whitespace-pre-wrap break-all">
            {configOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
