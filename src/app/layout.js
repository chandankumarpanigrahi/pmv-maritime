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
  title: {
    default: "Home - PMV Maritime Solutions",
    template: "%s - PMV Maritime Solutions",
  },
  description: "Delivering integrated solutions across vessel management, crewing, marine consultancy, shipbuilding, port operations, and technical management.",
  keywords: [
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
  authors: [{ name: "PMV Maritime Solutions" }],
  openGraph: {
    title: "PMV Maritime | Integrated Maritime Solutions",
    description: "Delivering integrated solutions across vessel management, crewing, marine consultancy, shipbuilding, port operations, and technical management.",
    url: "https://www.pmvmaritime.com",
    siteName: "PMV Maritime",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex flex-col relative">
        <ClientLayout maintenanceMode={MAINTENANCE_MODE} showLoader={SHOW_LOADER}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
