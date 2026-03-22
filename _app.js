import '../styles/globals.css'
import { DM_Mono, DM_Sans } from 'next/font/google'

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] })

export default function App({ Component, pageProps }) {
  return (
    <main className={`${dmMono.variable} ${dmSans.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}
