import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/store/provider';
import { AppInitializer } from '@/components/layout/AppInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'City Library',
  description: 'Your community hub for books, events, and lifelong learning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <StoreProvider>
          <AppInitializer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
