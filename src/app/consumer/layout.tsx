import StoreProvider from "@/redux/StoreProvider";
import "rsuite/dist/rsuite-no-reset.min.css";
import {
  Container,
  Content,
  CustomProvider,
  Footer,
  Header,
  Sidebar,
} from "rsuite";
import DashSidebar from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/consumer/Navber";
import ConsumerFooter from "@/components/layout/consumer/ConsumerFooter";

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
              <Content>{children}</Content>
            </Container>
            <Footer>
              <ConsumerFooter />
            </Footer>
          </CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
