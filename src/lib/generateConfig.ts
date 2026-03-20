/** Map onboarding service names to Lucide icon names */
export const SERVICE_ICON_MAP: Record<string, string> = {
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
export const SERVICE_DESC_MAP: Record<string, string> = {
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

export interface AgencyData {
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

export function formatPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneDisplay(phone: string): string {
  const digits = formatPhoneDigits(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function agencySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateConfigTS(agency: AgencyData): string {
  const template = agency.template || "heritage";
  const phone = formatPhoneDigits(agency.phone);
  const phoneDisplay = formatPhoneDisplay(agency.phone);
  const slug = agencySlug(agency.agency_name);
  const siteUrl = agency.domain_preferred
    ? `https://${agency.domain_preferred.replace(/^https?:\/\//, "")}`
    : `https://${slug}.agencybrain.com`;

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

  return `import type { AgencyConfig, TeamMember, TemplateName } from './config.types';
export type { TeamMember, TemplateName };

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
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
    ${JSON.stringify(agency.hero_image_url || "/images/hero.jpg")},
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
