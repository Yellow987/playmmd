"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { ChakraThemeProvider } from "../providers/chakraThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import outputs from "../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import ReduxProvider from "@/redux/ReduxProvider";


Amplify.configure(outputs);

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
            <ReduxProvider>
              <Header />
              {children}
              <Footer />
            </ReduxProvider>
          </Authenticator.Provider>
        </ChakraThemeProvider>
      </body>
    </html>
  );
}
