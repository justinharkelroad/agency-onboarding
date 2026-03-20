"use client";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (template: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  colors: { bg: string; accent: string };
}

interface Tier {
  name: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  borderSelected: string;
  templates: Template[];
}

const tiers: Tier[] = [
  {
    name: "Standard",
    badge: "Standard",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    borderSelected: "border-blue-500 ring-blue-500/20",
    templates: [
      {
        id: "heritage",
        name: "Heritage",
        description:
          "Classic navy & gold, editorial serif, corporate trust",
        colors: { bg: "#1A3A5C", accent: "#C9963B" },
      },
      {
        id: "momentum",
        name: "Momentum",
        description:
          "Bold modern, photo collage, SaaS-inspired energy",
        colors: { bg: "#0F172A", accent: "#22C55E" },
      },
      {
        id: "prestige",
        name: "Prestige",
        description:
          "Dark luxury, charcoal & gold, elegant editorial",
        colors: { bg: "#44403C", accent: "#D4A574" },
      },
    ],
  },
  {
    name: "Premium",
    badge: "Premium",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    borderSelected: "border-amber-500 ring-amber-500/20",
    templates: [
      {
        id: "apex",
        name: "Apex",
        description:
          "Stripe-inspired, gradient glass cards, conversion-optimized",
        colors: { bg: "#0A0A23", accent: "#635BFF" },
      },
      {
        id: "cornerstone",
        name: "Cornerstone",
        description:
          "Magazine editorial, forest green & copper",
        colors: { bg: "#1B3A2D", accent: "#C47A4A" },
      },
      {
        id: "summit",
        name: "Summit",
        description:
          "Apple-minimal, massive whitespace, warm amber",
        colors: { bg: "#FAFAF9", accent: "#D97706" },
      },
    ],
  },
  {
    name: "Elite",
    badge: "Elite",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    borderSelected: "border-purple-500 ring-purple-500/20",
    templates: [
      {
        id: "vanguard",
        name: "Vanguard",
        description:
          "Kinetic violet & neon, cinematic, horizontal scroll",
        colors: { bg: "#1E103A", accent: "#A78BFA" },
      },
      {
        id: "forge",
        name: "Forge",
        description:
          "Industrial-warm, blueprint cards, artisanal craft",
        colors: { bg: "#292524", accent: "#EA580C" },
      },
      {
        id: "meridian",
        name: "Meridian",
        description:
          "Futuristic dark mode, holographic, sci-fi trust",
        colors: { bg: "#09090B", accent: "#06B6D4" },
      },
    ],
  },
];

export default function TemplatePicker({
  selected,
  onSelect,
}: TemplatePickerProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose a Template
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Select a design template for this agency&apos;s website. All templates
          include the same conversion features (click-to-call, quote forms, SEO).
        </p>
      </div>

      <div className="space-y-10">
        {tiers.map((tier) => (
          <div key={tier.name}>
            {/* Tier header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tier.badgeBg} ${tier.badgeText}`}
              >
                {tier.badge}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Template cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tier.templates.map((template) => {
                const isSelected = selected === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => onSelect(template.id)}
                    className={`text-left rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? `${tier.borderSelected} shadow-lg ring-2`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {/* Visual preview header */}
                    <div
                      className="h-24 relative"
                      style={{ backgroundColor: template.colors.bg }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-white/90 text-lg font-bold tracking-wide"
                          style={{
                            fontFamily:
                              template.id === "prestige" || template.id === "cornerstone"
                                ? "Georgia, serif"
                                : "system-ui, sans-serif",
                          }}
                        >
                          {template.name}
                        </span>
                      </div>
                      {/* Accent stripe */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      {/* Tier badge inside card */}
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.badgeBg} ${tier.badgeText}`}
                        >
                          {tier.badge}
                        </span>
                      </div>
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* All templates include note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm font-medium">
          All templates include:
        </p>
        <ul className="text-blue-700 text-sm mt-1 space-y-0.5">
          <li>
            &#10003; Click-to-call buttons (navbar, hero, CTA, sticky mobile bar)
          </li>
          <li>&#10003; Lead capture quote forms (inline + contact page)</li>
          <li>
            &#10003; SEO pre-coded with city, state, ZIP, service areas
          </li>
          <li>
            &#10003; LocalBusiness + FAQ schema markup
          </li>
          <li>&#10003; Mobile-first responsive design</li>
          <li>&#10003; GA4 + Metricool tracking ready</li>
        </ul>
      </div>
    </div>
  );
}
