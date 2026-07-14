import { Nunito_Sans, Oswald } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

// ============================
// 🔧 MAINTENANCE MODE TOGGLE
// Set to `true` to show maintenance page
// Set to `false` to show normal website
// ============================
export const MAINTENANCE_MODE = true;

// ============================
// ⏳ LOADER TOGGLE
// Set to `true` to show loader on page load
// Set to `false` to disable loader
// ============================
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
  title: "PMV Maritime Solutions",
  description: "PMV Maritime operates at the intersection of technical precision and visionary management, delivering world-class marine surveys, technical vessel consultancy, audits, and professional maritime training.",
  keywords: [
    "PMV Maritime",
    "marine survey",
    "vessel inspection",
    "technical consultancy",
    "maritime training",
    "vessel management",
    "maritime logistics",
    "vessel audit",
    "cargo inspection",
    "marine engineering",
    "classification society support",
    "ship safety audit",
    "crew training"
  ],
  authors: [{ name: "PMV Maritime Solutions" }],
  openGraph: {
    title: "PMV Maritime | Global Marine Surveys, Technical Consultancy & Training",
    description: "PMV Maritime operates at the intersection of technical precision and visionary management, delivering world-class marine surveys, technical vessel consultancy, audits, and professional maritime training.",
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
