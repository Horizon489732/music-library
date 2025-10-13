import '@repo/ui/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'My Web App',
  description: 'Good luck on this journey!',
  icons: '/favicon.ico',
};

const dmSans = localFont({
  src: [
    { path: '../public/fonts/DMSans-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/DMSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/DMSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/DMSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/DMSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
