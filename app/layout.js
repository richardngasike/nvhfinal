import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://www.nairobivacanthouses.com'),
  applicationName: 'Nairobi Vacant Houses',
  authors: [{ name: 'Nairobi Vacant Houses', url: 'https://www.nairobivacanthouses.com' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  category: 'Real Estate',

  
  title: {
    default:
      'Nairobi Vacant Houses – Bedsitters, Single Rooms, 1, 2 & 3 Bedroom Houses for Rent in Nairobi',
    template: '%s | Nairobi Vacant Houses',
  },

  description:
    'Find verified vacant houses for rent in Nairobi. Browse bedsitters, single rooms, one bedroom, two bedroom and three bedroom apartments in Westlands, Kilimani, Kasarani, Pipeline, Embakasi, Karen, Langata, Githurai, Kahawa West, South B, South C, Ruaka, Rongai and more. Landlords post for only KES 300 via M-Pesa.',

  keywords: [
    'bedsitter for rent Nairobi',
    'bedsitter Nairobi',
    'bedsitter Westlands',
    'bedsitter Kilimani',
    'bedsitter Kasarani',
    'bedsitter Kahawa West',
    'bedsitter Githurai',
    'bedsitter Pipeline',
    'single room for rent Nairobi',
    'single room Nairobi',
    'one bedroom for rent Nairobi',
    '1 bedroom for rent Nairobi',
    'one bedroom Pipeline',
    'one bedroom Embakasi',
    'one bedroom Kasarani',
    'one bedroom Kilimani',
    'one bedroom Westlands',
    'two bedroom for rent Nairobi',
    '2 bedroom apartment Nairobi',
    'three bedroom for rent Nairobi',
    '3 bedroom house Nairobi',
    'cheap houses for rent Nairobi',
    'affordable houses Nairobi',
    'vacant houses Nairobi',
    'houses to let Nairobi',
    'apartments for rent Nairobi',
    'flats to let Nairobi',
    'furnished apartment Nairobi',
    'studio apartment Nairobi',
    'house for rent Westlands',
    'apartment Westlands Nairobi',
    'house for rent Kilimani',
    'apartment Kilimani Nairobi',
    'house for rent Kileleshwa',
    'house for rent Lavington',
    'house for rent Karen Nairobi',
    'house for rent Langata',
    'house for rent Gigiri',
    'house for rent Runda',
    'house for rent Muthaiga',
    'house for rent Spring Valley',
    'house for rent Parklands',
    'house for rent Upperhill',
    'house for rent South B Nairobi',
    'house for rent South C Nairobi',
    'house for rent Hurlingham',
    'house for rent Ngong Road',
    'house for rent Donholm',
    'house for rent Buruburu',
    'house for rent Imara Daima',
    'house for rent Fedha',
    'house for rent Kayole',
    'house for rent Kasarani Nairobi',
    'house for rent Kahawa West',
    'house for rent Kahawa Sukari',
    'house for rent Githurai',
    'house for rent Githurai 44',
    'house for rent Mwiki',
    'house for rent Mirema',
    'house for rent Roysambu',
    'house for rent Embakasi',
    'house for rent Pipeline Nairobi',
    'house for rent Tassia',
    'house for rent Komarock',
    'house for rent Umoja',
    'house for rent Dagoretti',
    'house for rent Kangemi',
    'house for rent Kawangware',
    'house for rent Ruaka',
    'house for rent Rongai',
    'house for rent Kitengela',
    'house for rent Syokimau',
    'house for rent Athi River',
    'house for rent Thika Road',
    'house for rent Kiambu Road',
    'house for rent Juja',
    'house for rent Ruiru',
    'post house for rent Nairobi',
    'list property Nairobi',
    'advertise house Kenya',
    'landlord Nairobi rental listing',
    'Nairobi property listing KES 300',
    'Kenya houses for rent',
    'Nairobi rental',
    'Nairobi real estate rent',
    'houses to rent Kenya',
    'rent apartment Nairobi',
    'NHC houses Nairobi',
    'Nairobi housing',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.nairobivacanthouses.com',
    siteName: 'Nairobi Vacant Houses',
    title:
      'Nairobi Vacant Houses – Find Bedsitters, Single Rooms & Apartments for Rent in Nairobi',
    description:
      'Browse thousands of verified vacant houses in Nairobi. Bedsitters from KES 4,500, single rooms, 1-3 bedroom apartments in Westlands, Kilimani, Kasarani, Pipeline, Embakasi and all major estates.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nairobi Vacant Houses – Find Your Perfect Rental Home in Nairobi, Kenya',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@NairobiVacant',
    creator: '@NairobiVacant',
    title: 'Nairobi Vacant Houses – Bedsitters & Apartments for Rent',
    description:
      'Find cheap houses for rent in Nairobi – bedsitters, single rooms, 1, 2 and 3 bedroom apartments in all Nairobi estates. Post your listing for KES 300 via M-Pesa.',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },

  alternates: {
    canonical: 'https://www.nairobivacanthouses.com',
    languages: {
      'en-KE': 'https://www.nairobivacanthouses.com',
    },
  },

  icons: {
    icon: [
      { url: '/nvhlogo.png', sizes: 'any' },
      { url: '/nvhlogo.png', type: 'image/png', sizes: '32x32' },
      { url: '/nvhlogo.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/nvhlogo.png',
  },

  manifest: '/manifest.json',

  other: {
    'geo.region': 'KE-30',
    'geo.placename': 'Nairobi, Kenya',
    'geo.position': '-1.286389;36.817223',
    ICBM: '-1.286389, 36.817223',
    'format-detection': 'telephone=yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Nairobi Vacant Houses',
    'msapplication-TileColor': '#C8A96E',
    'theme-color': '#1A1A2E',
    rating: 'general',
    revisit: '3 days',
    language: 'English',
    country: 'Kenya',
  },
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
