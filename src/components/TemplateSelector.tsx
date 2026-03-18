"use client";

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: "heritage",
    name: "Heritage",
    subtitle: "Classic & Professional",
    description:
      "Clean, split layout with your headline on the left and a large photo on the right. Stats bar highlights your experience. Best for established agencies that want to project trust and professionalism.",
    photoSummary: "1 hero photo + team headshots",
    preview: {
      bg: "#1A3A5C",
      accent: "#C9963B",
      layout: "split",
    },
  },
  {
    id: "momentum",
    name: "Momentum",
    subtitle: "Bold & Modern",
    description:
      "Bold, energetic design with large typography and a photo collage showcasing your community. Pill-shaped buttons, colorful accents. Best for agencies wanting to feel fresh and modern.",
    photoSummary: "4-6 lifestyle photos + team headshots",
    preview: {
      bg: "#0F172A",
      accent: "#22C55E",
      layout: "collage",
    },
  },
  {
    id: "prestige",
    name: "Prestige",
    subtitle: "Premium & Editorial",
    description:
      "Full-width hero image with elegant text overlay. Warm, refined tones with editorial typography. Dark accent sections. Best for agencies that want to project authority and sophistication.",
    photoSummary: "1 hero photo + 1 lifestyle photo + team headshots",
    preview: {
      bg: "#44403C",
      accent: "#D4A574",
      layout: "fullwidth",
    },
  },
];

export default function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => {
        const isSelected = selected === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={`text-left rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
              isSelected
                ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {/* Visual preview */}
            <div className="relative h-36 overflow-hidden" style={{ backgroundColor: template.preview.bg }}>
              {/* Mini layout preview */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {template.preview.layout === "split" && (
                  <div className="flex gap-3 w-full max-w-[200px]">
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-16 bg-white/70 rounded" />
                      <div className="h-1.5 w-24 bg-white/40 rounded" />
                      <div className="h-1.5 w-20 bg-white/30 rounded" />
                      <div className="flex gap-1.5 mt-3">
                        <div className="h-5 w-14 rounded-sm" style={{ backgroundColor: template.preview.accent }} />
                        <div className="h-5 w-14 rounded-sm bg-white/20" />
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-lg bg-white/15" />
                  </div>
                )}
                {template.preview.layout === "collage" && (
                  <div className="w-full max-w-[200px]">
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 bg-white/70 rounded font-bold" />
                        <div className="h-2 w-16 bg-white/40 rounded" />
                        <div className="flex gap-1.5 mt-2">
                          <div className="h-5 w-14 rounded-full" style={{ backgroundColor: template.preview.accent }} />
                          <div className="h-5 w-14 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 w-20">
                        <div className="h-9 rounded bg-white/15" />
                        <div className="h-9 rounded bg-white/10" />
                        <div className="h-9 rounded bg-white/10" />
                        <div className="h-9 rounded" style={{ backgroundColor: template.preview.accent, opacity: 0.4 }} />
                      </div>
                    </div>
                  </div>
                )}
                {template.preview.layout === "fullwidth" && (
                  <div className="w-full max-w-[220px] h-24 rounded-xl bg-white/10 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="h-2.5 w-28 bg-white/80 rounded mb-1.5" />
                      <div className="h-1.5 w-20 bg-white/40 rounded mb-2" />
                      <div className="flex gap-1.5">
                        <div className="h-4 w-12 rounded-sm" style={{ backgroundColor: template.preview.accent }} />
                        <div className="h-4 w-12 rounded-sm bg-white/20" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: template.preview.accent }} />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900 text-sm">
                  {template.name}
                </span>
                <span className="text-gray-400 text-xs">{template.subtitle}</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-2">
                {template.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>📷</span>
                <span>{template.photoSummary}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
