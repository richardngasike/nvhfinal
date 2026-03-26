import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: 'Nairobi Vacant Houses — Find Your Home in Nairobi',
    template: '%s | Nairobi Vacant Houses',
  },
  description: 'Discover affordable and premium rental houses in Nairobi. Search bedsitters, single rooms, 1-4+ bedroom apartments across all Nairobi estates.',
  keywords: ['Nairobi houses', 'rental houses Nairobi', 'apartments Nairobi', 'bedsitters', 'houses for rent'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nairobivacanthouses.com'),
  openGraph: {
    title: 'Nairobi Vacant Houses',
    description: 'Find your perfect rental home in Nairobi Kenya.',
    url: 'https://nairobivacanthouses.com',
    siteName: 'Nairobi Vacant Houses',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nairobi Vacant Houses',
    description: 'Find your perfect rental home in Nairobi Kenya.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="app-wrapper">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
