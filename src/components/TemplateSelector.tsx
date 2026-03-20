"use client";

import { useState } from "react";

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: string) => void;
}

const TIERS = [
  {
    name: "Standard",
    badge: "Included",
    badgeColor: "bg-blue-100 text-blue-700",
    templates: [
      {
        id: "heritage",
        name: "Heritage",
        subtitle: "Classic & Professional",
        description:
          "Navy & gold editorial layout. Serif headings, clean structure. Projects trust and legacy.",
        photoSummary: "1 hero photo + team headshots",
        screenshot:
          "/templates/heritage.png",
        colors: { bg: "#1A3A5C", accent: "#C9963B" },
      },
      {
        id: "momentum",
        name: "Momentum",
        subtitle: "Bold & Modern",
        description:
          "Bold sans-serif type, photo collage grid. Energetic and SaaS-inspired feel.",
        photoSummary: "4-6 lifestyle photos + team headshots",
        screenshot:
          "/templates/momentum.png",
        colors: { bg: "#0F172A", accent: "#5B8DB8" },
      },
      {
        id: "prestige",
        name: "Prestige",
        subtitle: "Premium & Editorial",
        description:
          "Dark charcoal & gold. Elegant serif typography. Luxury brand meets insurance.",
        photoSummary: "1 hero photo + 1 lifestyle + team headshots",
        screenshot:
          "/templates/prestige.png",
        colors: { bg: "#2D2D2D", accent: "#C9963B" },
      },
    ],
  },
  {
    name: "Premium",
    badge: "Upgrade",
    badgeColor: "bg-amber-100 text-amber-700",
    templates: [
      {
        id: "apex",
        name: "Apex",
        subtitle: "Conversion-Optimized",
        description:
          "Stripe-inspired. Gradient glass cards, split hero with quote form. Built to convert.",
        photoSummary: "1 hero photo + team headshots",
        screenshot:
          "/templates/apex.png",
        colors: { bg: "#1A2A3A", accent: "#20B2AA" },
      },
      {
        id: "cornerstone",
        name: "Cornerstone",
        subtitle: "Magazine Editorial",
        description:
          "Monocle-inspired. Forest green & copper, asymmetric layout, pull-quotes.",
        photoSummary: "2-3 editorial photos + team headshots",
        screenshot:
          "/templates/cornerstone.png",
        colors: { bg: "#1B4332", accent: "#B87333" },
      },
      {
        id: "summit",
        name: "Summit",
        subtitle: "Apple-Minimal",
        description:
          "Massive whitespace, single focal point per section. Premium through restraint.",
        photoSummary: "1 hero photo + 1 team photo",
        screenshot:
          "/templates/summit.png",
        colors: { bg: "#F5F3EF", accent: "#E8913A" },
      },
    ],
  },
  {
    name: "Elite",
    badge: "Premium",
    badgeColor: "bg-purple-100 text-purple-700",
    templates: [
      {
        id: "vanguard",
        name: "Vanguard",
        subtitle: "Cinematic & Bold",
        description:
          "Electric violet & neon lime. Kinetic typography, dramatic layouts. Show-stopper.",
        photoSummary: "3-4 dramatic photos + team headshots",
        screenshot:
          "/templates/vanguard.png",
        colors: { bg: "#0A0A0A", accent: "#7C3AED" },
      },
      {
        id: "forge",
        name: "Forge",
        subtitle: "Industrial & Artisanal",
        description:
          "Blueprint cards, hand-drawn accents, burnt sienna. Handcrafted premium feel.",
        photoSummary: "2-3 candid/authentic photos + team",
        screenshot:
          "/templates/forge.png",
        colors: { bg: "#F2EDE4", accent: "#C75B39" },
      },
      {
        id: "meridian",
        name: "Meridian",
        subtitle: "Futuristic & High-Tech",
        description:
          "Dark mode sci-fi. Holographic cards, cyan glow, dashboard widgets. Agency from 2030.",
        photoSummary: "1-2 photos + team headshots",
        screenshot:
          "/templates/meridian.png",
        colors: { bg: "#0B1426", accent: "#06B6D4" },
      },
    ],
  },
];

export default function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {TIERS.map((tier) => (
        <div key={tier.name}>
          {/* Tier header */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tier.badgeColor}`}
            >
              {tier.badge}
            </span>
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tier.templates.map((template) => {
              const isSelected = selected === template.id;
              const isExpanded = expandedId === template.id;

              return (
                <div key={template.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => onSelect(template.id)}
                    className={`text-left rounded-xl border-2 overflow-hidden transition-all cursor-pointer flex-1 ${
                      isSelected
                        ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {/* Screenshot preview */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={template.screenshot}
                        alt={`${template.name} template preview`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-4 h-4 text-white"
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
                        </div>
                      )}

                      {/* Tier badge on image */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.badgeColor} shadow-sm`}
                        >
                          {tier.name}
                        </span>
                      </div>

                      {/* Color accent bar */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {template.name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {template.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">
                          {template.photoSummary}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expand preview button */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : template.id)
                    }
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-center"
                  >
                    {isExpanded ? "Hide full preview" : "View full preview"}
                  </button>

                  {/* Expanded full screenshot */}
                  {isExpanded && (
                    <div className="mt-2 rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                      <img
                        src={template.screenshot}
                        alt={`${template.name} full preview`}
                        className="w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
