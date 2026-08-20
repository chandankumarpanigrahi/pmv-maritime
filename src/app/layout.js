import { Nunito_Sans, Oswald } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { getMaintenanceStatus } from "@/lib/maintenance";

export const SHOW_LOADER = false;

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport = {
  themeColor: "#007BA7",
  width: "device-width",
  initialScale: 1,
};

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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PMV Maritime",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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

export default async function RootLayout({ children }) {
  const maintenanceData = await getMaintenanceStatus();
  const maintenanceMode = Boolean(maintenanceData?.isEnabled);

  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5ZXFHR4');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col relative">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T5ZXFHR4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ClientLayout maintenanceMode={maintenanceMode} showLoader={SHOW_LOADER}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
