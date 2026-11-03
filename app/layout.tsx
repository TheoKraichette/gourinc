import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Gourou Inc.",
  description:
    "Fondez une secte. Gérez ses fidèles. Essayez de ne pas croire vos propres mensonges.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} font-ui antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
