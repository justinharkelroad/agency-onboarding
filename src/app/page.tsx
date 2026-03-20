"use client";

import { useState } from "react";
import Link from "next/link";

const TEMPLATES = [
  { name: "Heritage", tier: "Standard", img: "/templates/heritage.png", desc: "Classic & Professional" },
  { name: "Momentum", tier: "Standard", img: "/templates/momentum.png", desc: "Bold & Modern" },
  { name: "Prestige", tier: "Standard", img: "/templates/prestige.png", desc: "Premium & Editorial" },
  { name: "Apex", tier: "Premium", img: "/templates/apex.png", desc: "Conversion-Optimized" },
  { name: "Cornerstone", tier: "Premium", img: "/templates/cornerstone.png", desc: "Magazine Editorial" },
  { name: "Summit", tier: "Premium", img: "/templates/summit.png", desc: "Apple-Minimal" },
  { name: "Vanguard", tier: "Elite", img: "/templates/vanguard.png", desc: "Cinematic & Bold" },
  { name: "Forge", tier: "Elite", img: "/templates/forge.png", desc: "Industrial & Artisanal" },
  { name: "Meridian", tier: "Elite", img: "/templates/meridian.png", desc: "Futuristic & High-Tech" },
];

const STATS = [
  { value: "48hr", label: "Launch Time" },
  { value: "9", label: "Premium Templates" },
  { value: "100%", label: "Mobile Optimized" },
  { value: "0", label: "Code Required" },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
    ),
    title: "Designed to Convert",
    desc: "Every template is built with click-to-call, lead capture forms, and SEO baked in. Not just pretty — effective.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    ),
    title: "Live in 48 Hours",
    desc: "Fill out one form with your agency info. We handle design, setup, and deployment. You review and approve.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
    ),
    title: "Your Brand, Your Way",
    desc: "Your colors, your logo, your team photos, your story. We build it around you — not a generic template.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
    ),
    title: "Built for Local SEO",
    desc: "Schema markup, meta tags, service areas, and Google-ready content structure from day one.",
  },
];

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agency: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#0C0E14] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <img
            src="/logo.png"
            alt="AgencyBrain Pages"
            className="h-10 sm:h-14 w-auto"
          />
          <div className="flex items-center gap-4">
            <Link
              href="/onboard"
              className="hidden sm:inline text-sm text-white/40 hover:text-white transition-colors"
            >
              Client Portal
            </Link>
            <a
              href="#contact"
              className="bg-[#C4836A] hover:bg-[#D4937A] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C4836A]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#8B5E4B]/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-[#C4836A] rounded-full animate-pulse" />
            <span className="text-sm text-white/50">Now accepting agencies for Q2 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
            Insurance Websites
            <br />
            <span className="bg-gradient-to-r from-[#C4836A] via-[#D4937A] to-[#B8755F] bg-clip-text text-transparent">
              That Actually Sell
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium, conversion-optimized websites for P&C insurance agencies.
            Fill out one form. We build, deploy, and launch your site in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <a
              href="#contact"
              className="bg-[#C4836A] hover:bg-[#D4937A] text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#C4836A]/20"
            >
              Request a Preview
            </a>
            <a
              href="#templates"
              className="border border-white/10 hover:border-white/20 text-white font-medium text-base px-8 py-4 rounded-xl transition-all hover:bg-white/5"
            >
              Browse Templates
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#C4836A] mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-white/35 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-[#0E1018]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Another Template Mill
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              Every site is configured with your real data — your team, your services,
              your brand colors. It&apos;s your agency, on a site that performs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-[#C4836A]/20 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#C4836A]/10 text-[#C4836A] flex items-center justify-center mb-4 group-hover:bg-[#C4836A]/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              9 Templates. 3 Tiers.
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              From clean and professional to cinematic and bold.
              Every template is fully responsive, SEO-optimized, and conversion-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#C4836A]/25 transition-all hover:shadow-xl hover:shadow-[#C4836A]/5"
              >
                <div className="relative h-52 overflow-hidden bg-white/[0.02]">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        t.tier === "Standard"
                          ? "bg-white/10 text-white/70 border border-white/10"
                          : t.tier === "Premium"
                          ? "bg-[#C4836A]/20 text-[#D4937A] border border-[#C4836A]/20"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      {t.tier}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-xs text-white/25">{t.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 bg-[#0E1018]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to Launch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us About Your Agency",
                desc: "Fill out a quick form with your info, team, services, and branding. Upload your logo and photos.",
                color: "from-[#C4836A] to-[#A86B54]",
              },
              {
                step: "02",
                title: "We Build & You Preview",
                desc: "We configure your chosen template with your real data and deploy a preview within 48 hours.",
                color: "from-[#D4937A] to-[#C4836A]",
              },
              {
                step: "03",
                title: "Approve & Go Live",
                desc: "Review your site, request any tweaks, and we push it live on your custom domain.",
                color: "from-[#B8755F] to-[#9B6350]",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white font-bold text-lg mb-5`}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Lead Form */}
      <section id="contact" className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Stand Out?
              </h2>
              <p className="text-white/35">
                Tell us a bit about your agency and we&apos;ll reach out with a
                personalized preview of what your site could look like.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#C4836A]/10 border border-[#C4836A]/20 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-[#C4836A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-[#C4836A]"
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
                <h3 className="text-xl font-semibold mb-2">We&apos;ll Be in Touch</h3>
                <p className="text-white/40 text-sm">
                  Expect a personalized mockup in your inbox within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/35 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C4836A]/50 focus:ring-1 focus:ring-[#C4836A]/20 transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/35 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C4836A]/50 focus:ring-1 focus:ring-[#C4836A]/20 transition-colors"
                      placeholder="jane@agency.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/35 mb-1.5">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.agency}
                      onChange={(e) =>
                        setFormData({ ...formData, agency: e.target.value })
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C4836A]/50 focus:ring-1 focus:ring-[#C4836A]/20 transition-colors"
                      placeholder="Smith Insurance Group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/35 mb-1.5">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C4836A]/50 focus:ring-1 focus:ring-[#C4836A]/20 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C4836A] hover:bg-[#D4937A] text-white font-bold text-base py-4 rounded-xl transition-all hover:scale-[1.01] shadow-lg shadow-[#C4836A]/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Sending..." : "Get My Free Preview"}
                </button>
                <p className="text-center text-xs text-white/20">
                  No commitment. We&apos;ll send you a personalized mockup within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AgencyBrain Pages" className="h-6" />
            <span className="text-sm text-white/25">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/20">
            <Link href="/onboard" className="hover:text-white/40 transition-colors">
              Client Onboarding
            </Link>
            <Link href="/admin" className="hover:text-white/40 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
