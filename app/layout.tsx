import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "APECANN | Em breve",
  description: "APECANN, associação sediada em Recife.",
  robots: { index: false, follow: false },
  icons: { icon: "/apecann-logo.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
