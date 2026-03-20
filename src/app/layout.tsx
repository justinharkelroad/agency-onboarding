import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AgencyBrain Pages | Insurance Websites That Actually Sell",
  description:
    "Premium, conversion-optimized websites for P&C insurance agencies. 9 templates, 48-hour launch, built around your brand.",
  metadataBase: new URL("https://agencybrainpages.com"),
  openGraph: {
    title: "Insurance Websites That Actually Sell",
    description:
      "Premium, conversion-optimized websites for P&C insurance agencies. 9 templates. Live in 48 hours.",
    url: "https://agencybrainpages.com",
    siteName: "AgencyBrain Pages",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "AgencyBrain Pages — Insurance Websites That Actually Sell",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance Websites That Actually Sell",
    description:
      "Premium, conversion-optimized websites for P&C insurance agencies. 9 templates. Live in 48 hours.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
