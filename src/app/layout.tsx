import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import { CustomProvider } from "rsuite";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <CustomProvider>{children}</CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
