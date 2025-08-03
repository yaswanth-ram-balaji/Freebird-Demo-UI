import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-headline', weight: ['700'] });

export const metadata: Metadata = {
  title: 'GuardianLink',
  description: 'A safety and emergency communication app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable, montserrat.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
