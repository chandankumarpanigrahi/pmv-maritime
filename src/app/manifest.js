export default function manifest() {
  return {
    name: 'PMV | Pinnacle Marine Ventures',
    short_name: 'PMV Maritime',
    description:
      'Pinnacle Marine Ventures (PMV), operating as PMV Maritime Solutions, delivers integrated marine & vessel services, technical management, crewing, shipbuilding, port operations, and marine consultancy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1A2E',
    theme_color: '#007BA7',
    orientation: 'any',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
