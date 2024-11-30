import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import { CustomProvider } from "rsuite";
import SessionWrapper from "@/components/SessionWrapper";
export const metadata: Metadata = {
  title: "RMS",
  description: "Restaurant Management System",
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
          <CustomProvider>
            <SessionWrapper>{children}</SessionWrapper>
          </CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
