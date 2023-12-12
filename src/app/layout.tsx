import { ChakraThemeProvider } from "../providers/chakraThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ReduxProvider from "./redux/ReduxProvider";

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
          <ReduxProvider>
            <Header />
            {children}
            <Footer />
          </ReduxProvider>
        </ChakraThemeProvider>
      </body>
    </html>
  );
}
