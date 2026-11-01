import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function SiteLayout({ children }) {
  return (
    <>
      <a
        href="#main"
        className="focus:rounded-control focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
