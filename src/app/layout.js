import { Toaster } from "sonner";
import "./globals.css";
import OfflineBanner from '@/components/OfflineBanner';
import SyncInit from '@/components/SyncInit';

export const metadata = {
  title: "Bank Sampah Digital Anambas",
  description: "Sistem Manajemen Bank Sampah Digital Kepulauan Anambas",
  manifest: "/manifest.json",
  keywords: ["bank sampah", "anambas", "daur ulang", "sampah digital"],
  authors: [{ name: "Bank Sampah Anambas" }],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Bank Sampah Digital Anambas",
    description: "Sistem Manajemen Bank Sampah Digital Kepulauan Anambas",
    type: "website",
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
        
        {/* Tambahkan pembungkus utama ini dengan padding top agar responsif di HP vertikal */}
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