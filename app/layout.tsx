import type { Metadata } from "next";
import "./globals.css";

const title = "APECANN | Ciência que muda o olhar";
const description = "Pesquisa e desenvolvimento em cannabis medicinal. Desenvolvimento científico com dimensão social, orientado ao bem-estar de pessoas e animais.";
const siteUrl = process.env.APECANN_PUBLIC_URL || "http://localhost:3107";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    siteName: "APECANN",
    locale: "pt_BR",
    type: "website",
    url: "./",
    images: [{
      url: "compartilhar-apecann.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "APECANN. Ciência que muda o olhar. Um casal com seu cachorro junto ao mar.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["compartilhar-apecann.jpg"],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
