import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/shared/components/Nav";
import { AuthProvider } from "@/user-auth/context/AuthContext";
import { CartProvider } from "@/cart/context/CartContext";
import { SuggestionBox } from "@/suggestions/components/SuggestionBox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store",
  description: "Shop our products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var r=sessionStorage.getItem('spa-redirect');if(r){sessionStorage.removeItem('spa-redirect');window.history.replaceState(null,'',r);}})();` }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <SuggestionBox />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
