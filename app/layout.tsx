import './globals.css'
import { Raleway } from 'next/font/google'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
const inter = Raleway({ subsets: ["latin"]})

export const metadata = {
  title: 'SmallShop',
  description: 'An app for small shops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
            <ToastContainer />
      </body>
  
    </html>
  )
}
