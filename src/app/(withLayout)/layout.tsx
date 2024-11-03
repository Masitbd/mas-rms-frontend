import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Container, Content, CustomProvider, Header, Sidebar } from "rsuite";
import DashSidebar from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navber";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <StoreProvider>
          <CustomProvider>
            <Header>
              <Navbar />
            </Header>
            <Container className="rs-container-has-sidebar">
              <Sidebar>
                <DashSidebar />
              </Sidebar>

              <Content>{children}</Content>
            </Container>
          </CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
