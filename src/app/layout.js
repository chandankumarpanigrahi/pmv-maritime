import { Nunito_Sans, Oswald } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const MAINTENANCE_MODE = false;
export const SHOW_LOADER = true;

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://pmvmaritime.com"),
  title: {
    default: "PMV | Pinnacle Marine Ventures (PMV Maritime Solutions)",
    template: "%s | PMV - Pinnacle Marine Ventures",
  },
  description: "Pinnacle Marine Ventures (PMV), operating as PMV Maritime Solutions, delivers integrated marine & vessel services, technical management, crewing, shipbuilding, port operations, and marine consultancy.",
  keywords: [
    'PMV',
    'Pinnacle Marine Ventures',
    'Pinacle Marine Ventures',
    'PMV Maritime Solutions',
    'PMV Marine',
    'Marine Consultancy',
    'Maritime Training',
    'Ship Building',
    'Port Operations',
    'Marine Surveys',
    'Vessel Consultancy',
    'Audits & Inspections',
    'Vessel Management',
    'Technical Management',
    'Crew Management',
    'Ship Scrapping',
    'Pre-purchase Vessel Assessments'
  ],
  authors: [{ name: "Pinnacle Marine Ventures (PMV)" }],
  publisher: "Pinnacle Marine Ventures (PMV)",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://pmvmaritime.com/",
  },
  openGraph: {
    title: "PMV | Pinnacle Marine Ventures (PMV Maritime Solutions)",
    description: "Pinnacle Marine Ventures (PMV), operating as PMV Maritime Solutions, delivers integrated marine & vessel services, technical management, crewing, shipbuilding, port operations, and marine consultancy.",
    url: "https://pmvmaritime.com",
    siteName: "Pinnacle Marine Ventures (PMV)",
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pmvmaritime.com/#organization",
      "name": "Pinnacle Marine Ventures",
      "alternateName": [
        "PMV",
        "Pinacle Marine Ventures",
        "PMV Maritime Solutions",
        "PMV Maritime Solutions Limited"
      ],
      "url": "https://pmvmaritime.com",
      "logo": "https://pmvmaritime.com/logo.png",
      "description": "Pinnacle Marine Ventures (PMV), operating as PMV Maritime Solutions, delivers integrated marine and vessel services worldwide."
    },
    {
      "@type": "WebSite",
      "@id": "https://pmvmaritime.com/#website",
      "url": "https://pmvmaritime.com",
      "name": "Pinnacle Marine Ventures (PMV)",
      "alternateName": ["PMV", "Pinacle Marine Ventures", "PMV Maritime Solutions"],
      "publisher": {
        "@id": "https://pmvmaritime.com/#organization"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col relative">
        <ClientLayout maintenanceMode={MAINTENANCE_MODE} showLoader={SHOW_LOADER}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
