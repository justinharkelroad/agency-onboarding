"use client";

interface PhotoChecklistProps {
  agency: {
    agency_name: string;
    logo_url: string;
    hero_image_url: string;
    team_members: Array<{
      name: string;
      photo_url: string;
    }>;
  };
  template: string;
}

interface PhotoItem {
  label: string;
  description: string;
  specs: string;
  uploaded: boolean;
  url?: string;
}

export default function PhotoChecklist({
  agency,
  template,
}: PhotoChecklistProps) {
  const basePhotos: PhotoItem[] = [
    {
      label: "Logo",
      description:
        "Agency logo. PNG or SVG with transparent background preferred.",
      specs: "Min 400x400px, transparent PNG or SVG",
      uploaded: !!agency.logo_url,
      url: agency.logo_url,
    },
    {
      label: "Hero Image",
      description:
        "Main banner photo. Storefront, team photo, or local community shot.",
      specs: "Min 1920x1080px, landscape orientation, high quality",
      uploaded: !!agency.hero_image_url,
      url: agency.hero_image_url,
    },
  ];

  // Team member photos
  const teamPhotos: PhotoItem[] = (agency.team_members || []).map((m) => ({
    label: `Headshot: ${m.name}`,
    description: `Professional headshot of ${m.name}. Shoulders up, good lighting.`,
    specs: "Min 600x800px, portrait orientation",
    uploaded: !!m.photo_url,
    url: m.photo_url,
  }));

  // Template-specific photos
  const templatePhotos: PhotoItem[] = [];
  if (template === "momentum") {
    for (let i = 0; i < 6; i++) {
      templatePhotos.push({
        label: `Gallery Image ${i + 1}`,
        description:
          i === 0
            ? "Primary collage image — happy family, community, or lifestyle shot"
            : `Supporting collage image — diverse people, community, local scenes`,
        specs: "Min 800x800px, square crop works best",
        uploaded: false, // Gallery images aren't in the current form
      });
    }
  }

  if (template === "prestige") {
    templatePhotos.push({
      label: "Secondary Lifestyle Image",
      description:
        "Warm, editorial photo for the about section. Family moment, local scene, or team working with clients.",
      specs: "Min 1200x800px, landscape, warm tones preferred",
      uploaded: false,
    });
  }

  const allPhotos = [...basePhotos, ...teamPhotos, ...templatePhotos];
  const uploadedCount = allPhotos.filter((p) => p.uploaded).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Photo Checklist
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Photos needed for the{" "}
            <span className="font-medium capitalize">{template}</span> template.
            Share this list with the agency.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-semibold text-gray-900">
            {uploadedCount}/{allPhotos.length}
          </span>
          <p className="text-gray-400 text-xs">uploaded</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{
            width: `${
              allPhotos.length > 0
                ? (uploadedCount / allPhotos.length) * 100
                : 0
            }%`,
          }}
        />
      </div>

      <div className="space-y-3">
        {allPhotos.map((photo, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
              photo.uploaded
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Status indicator */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                photo.uploaded ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              {photo.uploaded ? (
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
              ) : (
                <span className="text-gray-400 text-xs font-medium">
                  {i + 1}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm">
                  {photo.label}
                </span>
                {photo.uploaded && (
                  <span className="text-green-600 text-xs font-medium">
                    Uploaded
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                {photo.description}
              </p>
              <p className="text-gray-400 text-xs mt-0.5 font-mono">
                {photo.specs}
              </p>
            </div>

            {/* Thumbnail */}
            {photo.uploaded && photo.url && (
              <img
                src={photo.url}
                alt={photo.label}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
              />
            )}
          </div>
        ))}
      </div>

      {/* Copy-paste list for client */}
      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-2">
          Send to Client
        </h3>
        <p className="text-gray-500 text-xs mb-3">
          Copy this list and send it to {agency.agency_name} so they know what
          photos to provide.
        </p>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
{`Hi! Here's the photo list for your ${template.charAt(0).toUpperCase() + template.slice(1)} website template:

${allPhotos
  .filter((p) => !p.uploaded)
  .map((p, i) => `${i + 1}. ${p.label}\n   ${p.description}\n   Specs: ${p.specs}`)
  .join("\n\n")}

Tips for great photos:
• Use natural lighting when possible
• Horizontal (landscape) orientation for hero images
• Professional headshots for team photos
• High resolution (at least 1920px wide for banner images)

Send them over whenever you're ready!`}
          </pre>
        </div>
        <button
          onClick={() => {
            const text = allPhotos
              .filter((p) => !p.uploaded)
              .map(
                (p, i) =>
                  `${i + 1}. ${p.label}\n   ${p.description}\n   Specs: ${p.specs}`
              )
              .join("\n\n");
            navigator.clipboard.writeText(text);
          }}
          className="mt-3 text-sm text-blue-600 font-medium hover:underline cursor-pointer"
        >
          Copy photo list to clipboard
        </button>
      </div>
    </div>
  );
}
