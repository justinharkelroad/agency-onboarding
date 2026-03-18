"use client";

import { useState } from "react";

interface AgencyData {
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
  template: string | null;
  deployed_url: string | null;
  formspree_id: string | null;
  service_areas: string[] | null;
  ga_measurement_id: string | null;
}

interface ConfigGeneratorProps {
  agency: AgencyData;
  onUpdateField: (field: string, value: unknown) => void;
}

/** Map onboarding service names to Lucide icon names */
const SERVICE_ICON_MAP: Record<string, string> = {
  "Auto Insurance": "Car",
  "Home Insurance": "Home",
  "Life Insurance": "Heart",
  "Business Insurance": "Building2",
  "Renters Insurance": "Key",
  "Umbrella Insurance": "Shield",
  "Motorcycle Insurance": "Bike",
  "Boat / Watercraft Insurance": "Anchor",
  "RV Insurance": "Truck",
  "Flood Insurance": "Droplets",
  "Workers Compensation": "Briefcase",
  "Commercial Auto": "Truck",
};

/** Simple description generator per service */
const SERVICE_DESC_MAP: Record<string, string> = {
  "Auto Insurance":
    "Liability, collision, comprehensive, and roadside assistance. We shop multiple carriers to find your best rate.",
  "Home Insurance":
    "Protect your biggest investment. Coverage for your home, personal property, and liability.",
  "Life Insurance":
    "Term and whole life options to protect your family's financial future. Free needs analysis included.",
  "Business Insurance":
    "General liability, commercial property, workers' comp, and BOP policies tailored to small businesses.",
  "Renters Insurance":
    "Affordable coverage for your personal belongings, liability, and additional living expenses.",
  "Umbrella Insurance":
    "Extra liability protection beyond your auto and home policies. Essential for protecting your assets.",
  "Motorcycle Insurance":
    "Comprehensive motorcycle coverage including liability, collision, and uninsured motorist protection.",
  "Boat / Watercraft Insurance":
    "Protection for your boat, jet ski, or watercraft including liability and physical damage coverage.",
  "RV Insurance":
    "Specialized RV coverage for motorhomes, travel trailers, and campers — on the road and at the campsite.",
  "Flood Insurance":
    "Dedicated flood insurance coverage to protect your home and belongings from flood damage.",
  "Workers Compensation":
    "Workers' comp coverage to protect your employees and your business from workplace injury claims.",
  "Commercial Auto":
    "Business vehicle coverage for company cars, trucks, vans, and fleets. Liability and physical damage options.",
};

function formatPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function formatPhoneDisplay(phone: string): string {
  const digits = formatPhoneDigits(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function generateConfigTS(agency: AgencyData): string {
  const template = agency.template || "heritage";
  const phone = formatPhoneDigits(agency.phone);
  const phoneDisplay = formatPhoneDisplay(agency.phone);
  const slug = agency.agency_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const siteUrl = agency.domain_preferred
    ? `https://${agency.domain_preferred.replace(/^https?:\/\//, "")}`
    : `https://${slug}.vercel.app`;

  const services = (agency.services || []).map((s) => ({
    title: s,
    description:
      SERVICE_DESC_MAP[s] ||
      `Professional ${s.toLowerCase()} coverage tailored to your needs. Contact us for a free quote.`,
    icon: SERVICE_ICON_MAP[s] || "Shield",
  }));

  const team = (agency.team_members || [])
    .filter((m) => m.name)
    .map((m) => ({
      name: m.name,
      title: m.title || "Team Member",
      bio:
        m.bio ||
        `${m.name} is a dedicated member of the ${agency.agency_name} team.`,
      image: m.photo_url || "/images/team/placeholder.jpg",
    }));

  const social: Record<string, string> = {};
  if (agency.social_facebook) social.facebook = agency.social_facebook;
  if (agency.social_google) social.google = agency.social_google;
  if (agency.social_instagram) social.instagram = agency.social_instagram;
  if (agency.social_linkedin) social.linkedin = agency.social_linkedin;
  if (agency.social_yelp) social.yelp = agency.social_yelp;

  const serviceAreas = agency.service_areas || [];
  const carriers = agency.carriers
    ? agency.carriers.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const highlights = Array.isArray(agency.highlights)
    ? agency.highlights
    : [];

  const metaDescription = `${agency.agency_name} in ${agency.address_city}, ${agency.address_state} — your trusted local insurance agency offering ${services
    .slice(0, 3)
    .map((s) => s.title.toLowerCase())
    .join(", ")}${services.length > 3 ? ", and more" : ""}. Call ${phoneDisplay} for a free quote today.`;

  return `import type { AgencyConfig } from './config.types';

const config: AgencyConfig = {
  template: '${template}',

  agencyName: ${JSON.stringify(agency.agency_name)},
  tagline: ${JSON.stringify(agency.tagline || "Protecting What Matters Most")},
  phone: '${phone}',
  phoneDisplay: '${phoneDisplay}',
  email: ${JSON.stringify(agency.email)},
  address: {
    street: ${JSON.stringify(agency.address_street)},
    city: ${JSON.stringify(agency.address_city)},
    state: ${JSON.stringify(agency.address_state)},
    zip: ${JSON.stringify(agency.address_zip)},
    full: ${JSON.stringify(`${agency.address_street}, ${agency.address_city}, ${agency.address_state} ${agency.address_zip}`)},
  },
  officeHours: ${JSON.stringify(agency.office_hours || "Mon–Fri 9:00 AM – 5:00 PM")},
  yearsInBusiness: ${agency.years_in_business || 0},

  logo: ${JSON.stringify(agency.logo_url || "/images/logo.png")},
  heroImage: ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
  ${template === "momentum" ? `galleryImages: [
    "/images/gallery/family-1.jpg",
    "/images/gallery/family-2.jpg",
    "/images/gallery/community.jpg",
    "/images/gallery/office.jpg",
    "/images/gallery/handshake.jpg",
    "/images/gallery/family-3.jpg",
  ],\n  ` : ""}colors: {
    primary: ${JSON.stringify(agency.color_primary || "#1A3A5C")},
    secondary: ${JSON.stringify(agency.color_secondary || "#2E75B6")},
    accent: ${JSON.stringify(agency.color_accent || "#C9963B")},
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
  },

  aboutText: ${JSON.stringify(agency.about_text || `${agency.agency_name} is your trusted local insurance agency, proudly serving the ${agency.address_city} community.`)},
  aboutHighlights: ${JSON.stringify(highlights, null, 4)},

  team: ${JSON.stringify(team, null, 4)},

  services: ${JSON.stringify(services, null, 4)},

  carriers: ${JSON.stringify(carriers)},

  social: ${JSON.stringify(social, null, 4)},
  googleMapsEmbedUrl: ${JSON.stringify(agency.google_maps_url || "")},

  siteUrl: '${siteUrl}',
  metaDescription: ${JSON.stringify(metaDescription)},
  serviceAreas: ${JSON.stringify(serviceAreas)},

  formspreeId: ${JSON.stringify(agency.formspree_id || "REPLACE_ME")},
};

export default config;
`;
}

export default function ConfigGenerator({
  agency,
  onUpdateField,
}: ConfigGeneratorProps) {
  const [copied, setCopied] = useState(false);

  // Deployment settings fields
  const [formspreeId, setFormspreeId] = useState(agency.formspree_id || "");
  const [serviceAreas, setServiceAreas] = useState(
    (agency.service_areas || []).join(", ")
  );
  const [gaId, setGaId] = useState(agency.ga_measurement_id || "");
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
    onUpdateField("deployed_url", deployedUrl || null);
  }

  return (
    <div className="space-y-8">
      {/* Deployment settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Deployment Settings
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Fill these in before generating the config. These get saved to the
          database and included in the generated config.
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deployed URL
            </label>
            <input
              type="text"
              value={deployedUrl}
              onChange={(e) => setDeployedUrl(e.target.value)}
              placeholder="https://agency-name.vercel.app"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          {[
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
              check: !!formspreeId,
              label: "Formspree ID configured",
              detail: formspreeId || "Missing",
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
          ].map((item) => (
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
      </div>

      {/* Generated config */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Generated config.ts</h3>
            <p className="text-gray-500 text-sm mt-1">
              Copy this into the agency-template project&apos;s{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                src/config.ts
              </code>{" "}
              file, then deploy to Vercel.
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

        <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
          <pre className="text-green-400 text-xs leading-relaxed font-mono">
            {configOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
