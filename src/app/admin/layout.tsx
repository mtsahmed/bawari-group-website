import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import "../globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Bawari Group — Admin",
  description: "Internal admin panel for Bawari Group.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-neutral text-brand-charcoal">
        {children}
      </body>
    </html>
  );
}
