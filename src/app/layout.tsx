"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { ChakraThemeProvider } from "../providers/chakraThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraThemeProvider>
          <Authenticator.Provider>
            <Header />
            {children}
            <Footer />
          </Authenticator.Provider>
        </ChakraThemeProvider>
      </body>
    </html>
  );
}
