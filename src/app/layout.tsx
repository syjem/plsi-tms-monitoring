import { BackgroundBottom, BackgroundTop } from '@/components/backgrounds';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthUserProvider } from '@/provider/auth-user.provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Phillogix Systems Monitoring',
  description: 'AI-powered PDF data extraction and analysis web app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundTop />
        <BackgroundBottom />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthUserProvider>{children}</AuthUserProvider>
          <Toaster
            position="bottom-center"
            richColors
            className="print:hidden"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
