const SITE_URL = "https://pmvmaritime.com";
const SITE_NAME = "Pinnacle Marine Ventures (PMV)";

export function createPageMetadata({ title, description, path }) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  return {
    title: `${title} | PMV - Pinnacle Marine Ventures`,
    description,
    publisher: SITE_NAME,
    keywords: [
      'PMV',
      'Pinnacle Marine Ventures',
      'Pinacle Marine Ventures',
      'PMV Maritime Solutions',
      'PMV Marine'
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
  };
}
