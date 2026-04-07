import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const notoSansArabic = Noto_Sans_Arabic({
   subsets: ['arabic'],
   variable: '--font-arabic',
   weight: ['300', '400', '500', '600', '700'],
});

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
});

export const metadata: Metadata = {
   title: 'فكس أب - خدمات المنزل الاحترافية',
   description:
      'تواصل مع محترفين محليين موثوقين لجميع احتياجات الإصلاح والصيانة المنزلية',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="ar"
         dir="rtl"
         suppressHydrationWarning
         className={cn(
            'h-full',
            'antialiased',
            geistSans.variable,
            geistMono.variable,
            notoSansArabic.variable,
            'font-sans',
            inter.variable
         )}
      >
         <body className="min-h-full flex flex-col">
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange={false}
            >
               <AuthProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Toaster position="top-center" richColors closeButton />
               </AuthProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
