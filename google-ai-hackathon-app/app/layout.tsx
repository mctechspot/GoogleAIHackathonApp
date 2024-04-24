import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css";
import MainLayout from "@/app/components/Layouts/MainLayout";
const inter = Inter({ subsets: ["latin"] });
const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-zen-kaku-gothic-antique',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jenna",
  description: "Intelligent Content Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={"dark"}>
      <body className={`${inter.className} ${zenKakuGothicAntique.className}`}>
          <MainLayout>
            {children}
          </MainLayout>
      </body>
    </html>
  );
}
