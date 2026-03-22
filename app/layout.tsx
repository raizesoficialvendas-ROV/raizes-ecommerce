import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import CartDrawer from "@/components/layout/CartDrawer";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#F8F5F0",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Raízes — Moda com Alma",
    template: "%s | Raízes",
  },
  description:
    "Raízes é um e-commerce de moda de luxo que celebra a identidade, a autenticidade e o artesanato. Peças exclusivas com alma.",
  keywords: ["moda", "luxo", "e-commerce", "raízes", "artesanato", "exclusivo"],
  authors: [{ name: "Raízes" }],
  creator: "Raízes",
  metadataBase: new URL("https://raizes.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://raizes.com.br",
    siteName: "Raízes",
    title: "Raízes — Moda com Alma",
    description: "Peças exclusivas que carregam identidade e propósito.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Raízes — Moda com Alma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raízes — Moda com Alma",
    description: "Peças exclusivas que carregam identidade e propósito.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <body className="bg-ivory text-obsidian antialiased" suppressHydrationWarning>
        <CartDrawer />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
