import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OSADHO RECORDS | Residential Recording Studio in the Himalayas",
  description:
    "Nestled in Harsil Valley, Uttarakhand, India, Osadho Records is a premium residential recording studio and boutique artist retreat for creative flow, musical recording, and Himalayan serenity.",
  keywords: [
    "recording studio",
    "residential studio",
    "himalayas",
    "harsil valley",
    "music residency",
    "artist retreat",
    "uttarakhand",
    "india studio",
    "creative space",
  ],
  authors: [{ name: "Osadho Records" }],
  openGraph: {
    title: "OSADHO RECORDS | Residential Recording Studio in the Himalayas",
    description:
      "Nestled in Harsil Valley, Uttarakhand, India, Osadho Records is a premium residential recording studio and boutique artist retreat.",
    url: "https://osadhorecords.com",
    siteName: "Osadho Records",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-ink text-cream selection:bg-gold selection:text-ink min-h-screen">
        {children}
      </body>
    </html>
  );
}
