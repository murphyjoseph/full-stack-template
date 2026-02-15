import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styled-system/styles.css";

export const metadata: Metadata = {
  title: "Full Stack Template",
  description: "Next.js + NestJS full stack template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
