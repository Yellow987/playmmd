"use client";
import { ChakraThemeProvider } from "../providers/chakraThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export const metadata = {
  title: "PlayMMD",
  description: "Play MMD animations in browser!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraThemeProvider>
          <Provider store={store}>
            <Header />
            {children}
            <Footer />
          </Provider>
        </ChakraThemeProvider>
      </body>
    </html>
  );
}
