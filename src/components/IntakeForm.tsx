"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import TeamMemberFields from "./TeamMemberFields";

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

  // Branding
  const [colorPrimary, setColorPrimary] = useState("#1A3A5C");
  const [colorSecondary, setColorSecondary] = useState("#2E75B6");
  const [colorAccent, setColorAccent] = useState("#C9963B");
  const [logo, setLogo] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);

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
      {/* ── AGENCY INFO ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Agency Information
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Basic details about your agency.
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
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── BRANDING ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Branding
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your colors, logo, and hero image. We&apos;ll use these to build your
          site&apos;s visual identity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
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
              Main brand color (headers, nav)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              Storefront, team photo, or local landmark. High-res preferred.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── ABOUT YOUR AGENCY ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          About Your Agency
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Tell your story. This appears on your About page.
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
              2-3 paragraphs. Separate paragraphs with a blank line.
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
              placeholder={"Locally owned and operated since 2010\nTop 10% Allstate agency nationwide\nOver 2,000 families protected\nA+ Better Business Bureau rating"}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              One per line. Awards, years of experience, families served, etc.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── SERVICES ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Services Offered
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Select all insurance types your agency offers.
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

      {/* ── CARRIERS ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Insurance Carriers
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Which carriers do you represent?
        </p>
        <input
          type="text"
          value={carriers}
          onChange={(e) => setCarriers(e.target.value)}
          placeholder="Allstate, Progressive, Safeco, National General"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Comma-separated list.
        </p>
      </section>

      <hr className="border-gray-200" />

      {/* ── TEAM MEMBERS ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Team Members
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Add your team. At minimum, include the agency owner.
        </p>
        <TeamMemberFields
          members={teamMembers}
          onChange={setTeamMembers}
        />
      </section>

      <hr className="border-gray-200" />

      {/* ── SOCIAL / ONLINE PRESENCE ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Online Presence
        </h2>
        <p className="text-gray-500 text-sm mb-6">
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
              Google Maps Link
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Search your address on Google Maps → Share → Embed → copy the
              src URL.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── DOMAIN ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Domain
        </h2>
        <p className="text-gray-500 text-sm mb-6">
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

      {/* ── NOTES ── */}
      <section>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-gray-900 mb-1">
          Anything Else?
        </h2>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special requests, existing brand guidelines, anything we should know..."
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
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
        {submitting ? "Submitting..." : "Submit & Get Started"}
      </button>
    </form>
  );
}
