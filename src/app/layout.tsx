import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COD3.0 Hackathon - El evento de programación más innovador del año",
  description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo. 48 horas de programación, networking y premios increíbles.",
  keywords: "hackathon, programación, desarrollo, tecnología, innovación, COD3.0, coding, developers",
  authors: [{ name: "COD3.0 Team" }],
  creator: "COD3.0 Hackathon",
  publisher: "COD3.0",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cod3-hackathon.vercel.app'),
  openGraph: {
    title: "COD3.0 Hackathon - El evento de programación más innovador del año",
    description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo.",
    url: 'https://cod3-hackathon.vercel.app',
    siteName: 'COD3.0 Hackathon',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'COD3.0 Hackathon',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "COD3.0 Hackathon - El evento de programación más innovador del año",
    description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo.",
    images: ['/og-image.jpg'],
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
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Press+Start+2P&family=Oxanium:wght@400;600;700;800&family=Exo+2:wght@400;600;700;800&family=Chakra+Petch:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
