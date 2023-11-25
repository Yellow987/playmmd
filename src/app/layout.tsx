import { ChakraThemeProvider } from "../providers/chakraThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";

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
          <Header />
          {children}
          <Footer />
        </ChakraThemeProvider>
      </body>
    </html>
  );
}
