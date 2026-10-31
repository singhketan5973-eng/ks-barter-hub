import { Fraunces, Public_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Barter Hub',
    template: '%s | Barter Hub',
  },
  description: 'Swap things and skills with people near you. No money needed.',
};

export const viewport = {
  themeColor: '#faf7f2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
