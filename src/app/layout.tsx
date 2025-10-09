import type { Metadata } from "next";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import Web3Provider from '@/components/Web3Provider';

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff00" />
        <meta name="msapplication-TileColor" content="#00ff00" />
        <meta name="msapplication-TileImage" content="/favicon-192x192.png" />
      </head>
      <body className="antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
