import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "TutorLink", template: "%s | TutorLink" },
  description:
    "Marketplace de tutorías universitarias: encuentra un tutor por materia, universidad y tarifa, reserva tu sesión y deja tu reseña.",
};

export const viewport: Viewport = {
  themeColor: "#2358e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
