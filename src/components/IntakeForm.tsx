"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import TeamMemberFields from "./TeamMemberFields";
import TemplateSelector from "./TemplateSelector";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo: File | null;
}

const SERVICES = [
  "Auto Insurance",
  "Home Insurance",
  "Life Insurance",
  "Business Insurance",
  "Renters Insurance",
  "Umbrella Insurance",
  "Motorcycle Insurance",
  "Boat / Watercraft Insurance",
  "RV Insurance",
  "Flood Insurance",
  "Workers Compensation",
  "Commercial Auto",
];

const emptyTeamMember: TeamMember = { name: "", title: "", bio: "", photo: null };

export default function IntakeForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Template
  const [template, setTemplate] = useState("");

  // Agency info
  const [agencyName, setAgencyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [officeHours, setOfficeHours] = useState("Mon–Fri 9:00 AM – 5:00 PM");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");

  // Branding
  const [colorPrimary, setColorPrimary] = useState("#1A3A5C");
  const [colorSecondary, setColorSecondary] = useState("#2E75B6");
  const [colorAccent, setColorAccent] = useState("#C9963B");
  const [logo, setLogo] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);

  // Gallery images (Momentum template)
  const [galleryImages, setGalleryImages] = useState<(File | null)[]>([
    null, null, null, null, null, null,
  ]);

  // Secondary lifestyle image (Prestige template)
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);

  // Content
  const [aboutText, setAboutText] = useState("");
  const [highlights, setHighlights] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [carriers, setCarriers] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { ...emptyTeamMember },
  ]);

  // Social
  const [facebook, setFacebook] = useState("");
  const [google, setGoogle] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [yelp, setYelp] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // Domain
  const [preferredDomain, setPreferredDomain] = useState("");
  const [ownsDomain, setOwnsDomain] = useState(false);

  // Notes
  const [notes, setNotes] = useState("");

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  function updateGalleryImage(index: number, file: File | null) {
    setGalleryImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  }

  async function uploadFile(file: File, path: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await getSupabase().storage
      .from("onboarding")
      .upload(fileName, file);
    if (error) throw error;
    const { data } = getSupabase().storage.from("onboarding").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!template) {
      setError("Please select a website template before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const slug = agencyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Upload logo
      let logoUrl = "";
      if (logo) {
        logoUrl = await uploadFile(logo, `${slug}/brand`);
      }

      // Upload hero image
      let heroUrl = "";
      if (heroImage) {
        heroUrl = await uploadFile(heroImage, `${slug}/brand`);
      }

      // Upload gallery images (Momentum)
      const galleryUrls: string[] = [];
      if (template === "momentum") {
        for (const img of galleryImages) {
          if (img) {
            const url = await uploadFile(img, `${slug}/gallery`);
            galleryUrls.push(url);
          }
        }
      }

      // Upload secondary image (Prestige)
      let secondaryUrl = "";
      if (template === "prestige" && secondaryImage) {
        secondaryUrl = await uploadFile(secondaryImage, `${slug}/brand`);
      }

      // Upload team photos
      const teamData = [];
      for (const member of teamMembers) {
        if (!member.name) continue;
        let photoUrl = "";
        if (member.photo) {
          photoUrl = await uploadFile(member.photo, `${slug}/team`);
        }
        teamData.push({
          name: member.name,
          title: member.title,
          bio: member.bio,
          photo_url: photoUrl,
        });
      }

      // Parse service areas
      const parsedServiceAreas = serviceAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Save to database
      const { error: dbError } = await getSupabase().from("submissions").insert({
        agency_name: agencyName,
        tagline,
        phone,
        email,
        address_street: street,
        address_city: city,
        address_state: state,
        address_zip: zip,
        office_hours: officeHours,
        years_in_business: parseInt(yearsInBusiness) || 0,
        color_primary: colorPrimary,
        color_secondary: colorSecondary,
        color_accent: colorAccent,
        logo_url: logoUrl,
        hero_image_url: heroUrl,
        about_text: aboutText,
        highlights: highlights.split("\n").filter(Boolean),
        services: selectedServices,
        carriers,
        team_members: teamData,
        social_facebook: facebook,
        social_google: google,
        social_instagram: instagram,
        social_linkedin: linkedin,
        social_yelp: yelp,
        google_maps_url: googleMapsUrl,
        domain_preferred: preferredDomain,
        domain_owned: ownsDomain,
        notes,
        template,
        service_areas: parsedServiceAreas,
      });

      if (dbError) throw dbError;

      window.location.href = "/success";
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong submitting your form. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* ── STEP 1: TEMPLATE SELECTION ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            1
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Choose Your Design
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Pick a website template. Each has a different look and feel, but all include click-to-call
          buttons, lead capture forms, and SEO optimization. You can&apos;t go wrong.
        </p>
        <TemplateSelector selected={template} onSelect={setTemplate} />
        {!template && error && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            Please select a template to continue.
          </p>
        )}
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 2: AGENCY INFO ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            2
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Agency Information
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Basic details about your agency. This appears throughout your website and in search results.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="Maxwell Insurance Agency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline / Slogan
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Protecting What Matters Most"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank and we&apos;ll create one for you.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              This is the main click-to-call number on your website.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@youragency.com"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main Street"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Springfield"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="TX"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="75001"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office Hours
            </label>
            <input
              type="text"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years in Business
            </label>
            <input
              type="number"
              min="0"
              value={yearsInBusiness}
              onChange={(e) => setYearsInBusiness(e.target.value)}
              placeholder="15"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Cities / Towns You Serve
            </label>
            <input
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              placeholder="Dallas, Fort Worth, Plano, Richardson"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Comma-separated. We&apos;ll include these in your website&apos;s search engine optimization so you show up in those areas too.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 3: BRANDING & PHOTOS ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            3
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Branding & Photos
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Your colors, logo, and photos. These build your site&apos;s visual identity.
        </p>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg py-3 px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Main brand color (headers, navigation)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg py-3 px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Links, accents</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorAccent}
                onChange={(e) => setColorAccent(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colorAccent}
                onChange={(e) => setColorAccent(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg py-3 px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Buttons, call-to-action
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              required
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              PNG, SVG, or JPG. Transparent background preferred.
            </p>
          </div>
        </div>

        {/* Hero Image — all templates */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-medium text-gray-900 text-sm mb-1">
            Hero Image <span className="text-red-500">*</span>
          </h3>
          <p className="text-gray-600 text-xs mb-3">
            {template === "heritage"
              ? "This appears on the right side of your homepage hero section. A storefront, team photo, or local community shot works best."
              : template === "prestige"
              ? "This is the full-width background image on your homepage. A warm, high-quality photo of a family, your office, or a local landmark works best."
              : template === "momentum"
              ? "This is the primary image in your homepage photo collage. A strong lifestyle or community shot works best."
              : "Your main banner photo. Storefront, team, or community shot."}
          </p>
          <div className="bg-white rounded-lg p-3">
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
          </div>
          <div className="mt-2 flex items-start gap-2">
            <span className="text-blue-500 text-xs mt-0.5">💡</span>
            <p className="text-blue-700 text-xs">
              <strong>Specs:</strong> Landscape orientation, at least 1920×1080px, high quality. Avoid blurry, dark, or heavily filtered photos.
            </p>
          </div>
        </div>

        {/* Gallery Images — Momentum only */}
        {template === "momentum" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              Gallery Photos (4-6 images)
            </h3>
            <p className="text-gray-600 text-xs mb-3">
              These create the photo collage grid on your homepage. Use a variety — families, community,
              your office, handshakes, local landmarks. The more diverse, the better it looks.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-green-100">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Photo {index + 1} {index < 4 && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={index < 4}
                    onChange={(e) =>
                      updateGalleryImage(index, e.target.files?.[0] || null)
                    }
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-green-50 file:text-green-700 file:font-medium file:text-xs"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-start gap-2">
              <span className="text-green-600 text-xs mt-0.5">💡</span>
              <p className="text-green-700 text-xs">
                <strong>Specs:</strong> Square or landscape, at least 800×800px each. Mix of people, community, and professional shots.
              </p>
            </div>
          </div>
        )}

        {/* Secondary Lifestyle Image — Prestige only */}
        {template === "prestige" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              Secondary Lifestyle Photo
            </h3>
            <p className="text-gray-600 text-xs mb-3">
              This appears in the about section of your site. A warm, candid photo — your team working with clients,
              a family moment, or a local scene.
            </p>
            <div className="bg-white rounded-lg p-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSecondaryImage(e.target.files?.[0] || null)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-medium hover:file:bg-amber-100"
              />
            </div>
            <div className="mt-2 flex items-start gap-2">
              <span className="text-amber-600 text-xs mt-0.5">💡</span>
              <p className="text-amber-700 text-xs">
                <strong>Specs:</strong> Landscape, at least 1200×800px, warm natural lighting preferred.
              </p>
            </div>
          </div>
        )}
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 4: ABOUT YOUR AGENCY ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            4
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            About Your Agency
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Tell your story. This appears on your About page and helps build trust with visitors.
        </p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Agency Story <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell us about how your agency got started, what makes you different, and why clients trust you..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              2-3 paragraphs. Separate paragraphs with a blank line. Don&apos;t worry about making it perfect — we can polish it.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Highlights / Accolades
            </label>
            <textarea
              rows={4}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder={"Locally owned and operated since 2010\nTop 10% agency nationwide\nOver 2,000 families protected\nA+ Better Business Bureau rating"}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              One per line. Awards, years of experience, families served, etc.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 5: SERVICES ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            5
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Services Offered
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Select all insurance types your agency offers. Each gets its own card on your website.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVICES.map((service) => (
            <label
              key={service}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedServices.includes(service)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 6: CARRIERS ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            6
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Insurance Carriers
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Which carriers do you represent? Listed as text on your site (no logos for compliance).
        </p>
        <input
          type="text"
          value={carriers}
          onChange={(e) => setCarriers(e.target.value)}
          placeholder="Progressive, Safeco, National General"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Comma-separated list.
        </p>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 7: TEAM MEMBERS ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            7
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Team Members
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-4 ml-10">
          Add your team. At minimum, include the agency owner.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-sm mt-0.5">📷</span>
            <p className="text-gray-600 text-xs">
              <strong>Headshot tips:</strong> Professional photo from shoulders up, good lighting,
              neutral background. At least 600×800px, portrait orientation.
            </p>
          </div>
        </div>
        <TeamMemberFields
          members={teamMembers}
          onChange={setTeamMembers}
        />
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 8: SOCIAL / ONLINE PRESENCE ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            8
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Online Presence
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Link your social profiles. Leave blank if you don&apos;t have one.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/youragency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Business Profile
            </label>
            <input
              type="url"
              value={google}
              onChange={(e) => setGoogle(e.target.value)}
              placeholder="https://g.page/youragency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/youragency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/youragency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yelp
            </label>
            <input
              type="url"
              value={yelp}
              onChange={(e) => setYelp(e.target.value)}
              placeholder="https://yelp.com/biz/youragency"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Google Maps → Search your address → Share → Embed → copy the src URL.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 9: DOMAIN ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            9
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Domain
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-10">
          Where should your site live?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Domain
            </label>
            <input
              type="text"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              placeholder="www.youragency.com"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={ownsDomain}
                onChange={(e) => setOwnsDomain(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700">
                I already own this domain
              </span>
            </label>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── STEP 10: NOTES ── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
            10
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900">
            Anything Else?
          </h2>
        </div>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special requests, existing brand guidelines, anything we should know..."
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y mt-4"
        />
      </section>

      {/* ── SUBMIT ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Uploading & Submitting..." : "Submit & Get Started"}
      </button>

      <p className="text-center text-gray-400 text-xs">
        After submitting, we&apos;ll review your information and have your website ready within 48 hours.
        You&apos;ll receive a preview link before we go live.
      </p>
    </form>
  );
}
