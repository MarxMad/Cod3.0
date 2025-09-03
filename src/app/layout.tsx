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
  metadataBase: new URL('https://cod3-0.vercel.app'),
  openGraph: {
    title: "COD3.0 Hackathon - El evento de programación más innovador del año",
    description: "Únete al hackathon COD3.0, donde desarrolladores, diseñadores y emprendedores se unen para crear soluciones innovadoras que cambien el mundo.",
    url: 'https://cod3-0.vercel.app',
    siteName: 'COD3.0 Hackathon',
    images: [
      {
        url: '/CODEN.png',
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
    images: ['/CODEN.png'],
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
        <link rel="icon" href="/CODEN.png" type="image/png" />
        <link rel="shortcut icon" href="/CODEN.png" type="image/png" />
        <link rel="apple-touch-icon" href="/CODEN.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/CODEN.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/CODEN.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/CODEN.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff00" />
        <meta name="msapplication-TileColor" content="#00ff00" />
        <meta name="msapplication-TileImage" content="/CODEN.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
