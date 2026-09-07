import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';

const title = 'Ahmed Sobhy | Senior Performance Media Buyer';
const description =
  'Scaling e-commerce revenue through data-driven performance marketing systems on Meta, Google, and TikTok.';

// Absolute URLs are required for social previews. Override in the hosting env
// (NEXT_PUBLIC_SITE_URL) once the production domain is confirmed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sobhy.marketing';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // og/twitter images are supplied automatically by app/opengraph-image.tsx.
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Sobhy.Marketing',
    title,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
