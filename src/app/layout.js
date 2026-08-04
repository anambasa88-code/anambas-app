import { Toaster } from "sonner";
import "./globals.css";
import OfflineBanner from '@/components/OfflineBanner';
import SyncInit from '@/components/SyncInit';

export const metadata = {
  // Title dibuat lebih spesifik dengan kata kunci target
  title: "Bank Sampah Digital Anambas | Kelola & Daur Ulang Sampah",
  description: "Platform resmi Sistem Manajemen Bank Sampah Digital Kepulauan Anambas. Tukar dan kelola sampah daur ulang Anda secara digital dan efisien.",
  manifest: "/manifest.json",
  keywords: [
    "bank sampah anambas", 
    "anambas", 
    "daur ulang anambas", 
    "sampah digital anambas",
    "kepulauan anambas",
    "bank sampah digital"
  ],
  authors: [{ name: "Bank Sampah Anambas" }],
  
  // Mengizinkan Google mengindeks halaman
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

  // Verifikasi Google Search Console
  verification: {
    google: "TmSdosAibn6d3KjkB0Vq9vkjY1IOOnYHGMyZWLTVyY4",
  },

  // Menentukan URL resmi website
  metadataBase: new URL('https://anambas.my.id'),
  alternates: {
    canonical: '/',
  },

  icons: {
    icon: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },

  // Optimasi tampilan share di Media Sosial (WhatsApp, FB, Twitter/X)
  openGraph: {
    title: "Bank Sampah Digital Anambas",
    description: "Sistem Manajemen Bank Sampah Digital Kepulauan Anambas",
    url: 'https://anambas.my.id',
    siteName: 'Bank Sampah Digital Anambas',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BankSampah" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased flex flex-col">
        <SyncInit />
        <OfflineBanner />
        
        <main className="flex-1 w-full pt-12 md:pt-14 isolation-auto">
          {children}
        </main>

        <Toaster richColors position="top-right" closeButton expand={false} />
        
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) { console.log('SW registered:', reg.scope) })
                  .catch(function(err) { console.log('SW failed:', err) })
              })
            }
          `
        }} />
      </body>
    </html>
  )
}