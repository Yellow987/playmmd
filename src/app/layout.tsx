import './globals.css'
import { ChakraThemeProvider } from '../providers/chakraThemeProvider';
import Footer from './../components/footer';
import Header from './../components/header';

export const metadata = {
  title: 'YellowDesi',
  description: 'Yellow\'s personal website :3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <ChakraThemeProvider>
          <Header />
          {children}
          <Footer />
        </ChakraThemeProvider>
      </body>
    </html>
  )
}
