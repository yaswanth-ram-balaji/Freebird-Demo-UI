import type { Metadata } from 'next';
import { Inter, Montserrat, Dancing_Script } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-headline', weight: ['700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-tagline', weight: ['700'] });

export const metadata: Metadata = {
  title: 'FreeBird',
  description: 'Stay Safe, Stay Connected',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable, montserrat.variable, dancingScript.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
