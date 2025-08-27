import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COD3.0 Hackathon - El evento de programación más innovador del año",
  description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo. 48 horas de programación, networking y premios increíbles.",
  keywords: [
    "hackathon",
    "programación",
    "desarrollo",
    "tecnología",
    "innovación",
    "COD3.0",
    "coding",
    "developers",
    "web3",
    "blockchain",
    "AI",
    "machine learning",
    "startup",
    "emprendimiento",
    "tecnología latinoamericana"
  ],
  authors: [{ name: "COD3.0 Team", url: "https://cod3-hackathon.vercel.app" }],
  creator: "COD3.0 Hackathon",
  publisher: "COD3.0",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cod3-hackathon.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/',
      'en': '/en',
      'pt': '/pt'
    }
  },
  openGraph: {
    title: "COD3.0 Hackathon - El evento de programación más innovador del año",
    description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo.",
    url: 'https://cod3-hackathon.vercel.app',
    siteName: 'COD3.0 Hackathon',
    images: [
      {
        url: '/CODEB.png',
        width: 512,
        height: 512,
        alt: 'COD3.0 Hackathon Logo',
        type: 'image/png',
      },
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'COD3.0 Hackathon - Evento de Programación',
        type: 'image/jpeg',
      },
    ],
    locale: 'es_ES',
    type: 'website',
    countryName: 'México',
  },
  twitter: {
    card: 'summary_large_image',
    title: "COD3.0 Hackathon - El evento de programación más innovador del año",
    description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo.",
    images: ['/CODEB.png', '/og-image.jpg'],
    creator: '@COD3Hackathon',
    site: '@COD3Hackathon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'technology',
  other: {
    'theme-color': '#22c55e',
    'msapplication-TileColor': '#22c55e',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'COD3.0',
    'mobile-web-app-capable': 'yes',
    'application-name': 'COD3.0 Hackathon',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/CODEB.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/CODEB.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/CODEB.png" />
        
        {/* Windows Tiles */}
        <meta name="msapplication-TileImage" content="/CODEB.png" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content="COD3.0 Hackathon" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="COD3.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "COD3.0 Hackathon",
              "description": "El evento de programación más innovador del año",
              "startDate": "2024-12-15T09:00:00",
              "endDate": "2024-12-17T18:00:00",
              "location": {
                "@type": "Place",
                "name": "Centro de Innovación Tech",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "MX",
                  "addressLocality": "Ciudad de México"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "COD3.0 Team",
                "url": "https://cod3-hackathon.vercel.app"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
