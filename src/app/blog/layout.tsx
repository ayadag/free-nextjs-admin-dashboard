import '@/blog/style/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/blog/providers';
import Layout from '@/components/blog/components/Layout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tailwindyt blog content",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex w-full bg-black overflow-hidden">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
