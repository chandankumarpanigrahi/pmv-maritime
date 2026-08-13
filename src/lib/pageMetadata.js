const SITE_URL = "https://www.pmvmaritime.com";
const SITE_NAME = "PMV Maritime";
const SITE_TITLE_SUFFIX = "PMV Maritime Solutions";

export function createPageMetadata({ title, description, path }) {
  const fullTitle = `${title} | ${SITE_TITLE_SUFFIX}`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
  };
}
