"use client";

interface TemplatePickerProps {
  selected: string | null;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: "heritage",
    name: "Heritage",
    subtitle: "Classic & Professional",
    description:
      "Split hero layout with headline left and photo right. Stats bar, clean service cards, circular team photos. The safe, trusted look that works for most agencies.",
    features: [
      "Split hero — text left, large photo right",
      "Stats bar (years, families protected, rating)",
      "3-column service icon cards",
      "Circular team member photos",
      "Classic serif + sans-serif typography",
    ],
    photosNeeded: [
      "1 hero image (storefront, team, or community)",
      "1 headshot per team member",
    ],
    bestFor: "Established agencies wanting a trustworthy, professional presence",
    colors: { bg: "#1A3A5C", accent: "#C9963B" },
  },
  {
    id: "momentum",
    name: "Momentum",
    subtitle: "Bold & Modern",
    description:
      "Oversized bold typography with a photo collage grid. Pill-shaped buttons, colorful service cards, social proof blocks. Energetic and eye-catching.",
    features: [
      "Bold oversized hero typography",
      "Photo collage / mosaic grid (4-6 images)",
      "Pill-shaped buttons throughout",
      "Service pills + colorful category cards",
      "Inline quote form below hero",
    ],
    photosNeeded: [
      "4-6 lifestyle/community photos (for collage)",
      "1 headshot per team member",
    ],
    bestFor: "Modern agencies wanting to stand out and feel energetic",
    colors: { bg: "#0F172A", accent: "#22C55E" },
  },
  {
    id: "prestige",
    name: "Prestige",
    subtitle: "Premium & Editorial",
    description:
      "Full-width hero image in a rounded container with text overlay. Warm, muted tones, editorial typography, dark contrast sections. Sophisticated and upscale.",
    features: [
      "Full-width hero image with rounded frame",
      "Text overlay with gradient",
      "Warm editorial serif typography",
      "Dark contrast CTA sections",
      "About teaser strip below hero",
    ],
    photosNeeded: [
      "1 high-quality hero image (family, lifestyle, or local)",
      "1 secondary lifestyle image",
      "1 headshot per team member",
    ],
    bestFor: "Premium agencies wanting to project authority and trust",
    colors: { bg: "#44403C", accent: "#D4A574" },
  },
];

export default function TemplatePicker({
  selected,
  onSelect,
}: TemplatePickerProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose a Template
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Select a design template for this agency&apos;s website. This
          determines the visual layout — all templates include the same
          conversion features (click-to-call, quote forms, SEO).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selected === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`text-left rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Visual preview header */}
              <div
                className="h-32 relative"
                style={{ backgroundColor: template.colors.bg }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span
                      className="block text-white/90 text-xl font-bold"
                      style={{ fontFamily: template.id === "prestige" ? "Georgia, serif" : "system-ui, sans-serif" }}
                    >
                      {template.name}
                    </span>
                    <span className="block text-white/60 text-xs mt-1">
                      {template.subtitle}
                    </span>
                  </div>
                </div>
                {/* Accent stripe */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: template.colors.accent }}
                />
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                <div className="mb-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Layout Features
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {template.features.map((f) => (
                      <li
                        key={f}
                        className="text-xs text-gray-500 flex items-start gap-1.5"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Photos Needed
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {template.photosNeeded.map((p) => (
                      <li
                        key={p}
                        className="text-xs text-gray-500 flex items-start gap-1.5"
                      >
                        <span className="text-blue-500 mt-0.5">📷</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Best For
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    {template.bestFor}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* All templates include note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm font-medium">
          All templates include:
        </p>
        <ul className="text-blue-700 text-sm mt-1 space-y-0.5">
          <li>
            ✓ Click-to-call buttons (navbar, hero, CTA, sticky mobile bar)
          </li>
          <li>✓ Lead capture quote forms (inline + contact page)</li>
          <li>
            ✓ SEO pre-coded with city, state, ZIP, service areas
          </li>
          <li>
            ✓ LocalBusiness + FAQ schema markup
          </li>
          <li>✓ Mobile-first responsive design</li>
          <li>✓ GA4 + Metricool tracking ready</li>
        </ul>
      </div>
    </div>
  );
}
