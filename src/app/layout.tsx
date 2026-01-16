import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MentoraSI - Mentoria para alunos da USP",
  description: "Conecte estudantes daUSP com ex-alunos mentores. Agende sessões de mentoria para receber orientação profissional e desenvolvimento de carreira.",
  keywords: ["mentoria", "ex-alunos", "USP" , "carreira", "orientação profissional", "estudantes"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "MentoraSI - Mentoria para alunos da USP",
    description: "Plataforma que conecta estudantes da USP com ex-alunos experientes. Agende sessões de mentoria para receber orientação profissional, conselhos de carreira e desenvolvimento pessoal.",
    url: "https://mentorasi.com",
    siteName: "MentoraSI",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://mentorasi.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MentoraSI - Mentoria para alunos da USP"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MentoraSI - Mentoria para alunos da USP",
    description: "Conecte estudantes da USP com ex-alunos mentores para orientação profissional.",
    images: ["https://mentorasi.com/twitter-image.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
