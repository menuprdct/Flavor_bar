import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";
import LayoutWithLoader from "@/subComp/LayoutWithLoader";
import MenuHeader from "@/components/header/header";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flavor Bar",
  description: "كل حاجه حلوة وليها طعمها ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LangProvider>
          <LayoutWithLoader>
            <div className="flex justify-end p-4">
              <MenuHeader
                logoUrl="https://i.ibb.co/4RDyB2hM/495445216-1019017483708459-4042802730785075468-n.jpg"
                title="Flavor Bar"
                subtitle="كل حاجه حلوة وليها طعمها "
              />
            </div>
            {children}
          </LayoutWithLoader>
        </LangProvider>
      </body>
    </html>
  );
}
