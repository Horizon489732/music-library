import '@repo/ui/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'My Web App',
  description: 'Good luck on this journey!',
  icons: '/favicon.ico',
};

const ibmPlexSans = localFont({
  src: [
    { path: '../public/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
});

const bebasNeue = localFont({
  src: [{ path: '../public/fonts/BebasNeue-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--bebas-neue',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
