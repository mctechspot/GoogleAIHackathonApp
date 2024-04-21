import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-zen-kaku-gothic-antique',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jenna",
  description: "Intelligent Literary Content Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${zenKakuGothicAntique.className}`}>{children}</body>
    </html>
  );
}
