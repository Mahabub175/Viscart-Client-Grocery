import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import "./globals.css";
import AntDProvider from "@/components/Shared/AntDProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import SEOHead from "@/components/Shared/Sidebar/SEOHead";

const interFont = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Viscart",
  description: "Complete E-Commerce Site",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <SEOHead />
      <GoogleTagManager gtmId="GTM-5LDJJ32D" />
      <body className={interFont.className}>
        <AntDProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AntDProvider>
      </body>
    </html>
  );
};

export default RootLayout;
