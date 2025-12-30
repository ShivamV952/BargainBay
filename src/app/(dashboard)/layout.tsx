import Layout from "@/components/Layout/Dashboard/Layout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ weight: ["400", "400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sell and Buy your products with us on our platform safely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout >{children}</Layout>
      </body>
    </html>
  );
}
