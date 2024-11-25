"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { system } from "@/config/theme";
import { Provider } from "@/components/ui/provider";
import { defaultSystem } from "@chakra-ui/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <html suppressHydrationWarning>
        <body>
          <Provider>
            <Authenticator.Provider>
              <Header />
              {children}
              <Footer />
            </Authenticator.Provider>
          </Provider>
        </body>
      </html>
    </html>
  );
}
