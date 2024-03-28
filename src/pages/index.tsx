import Image from 'next/image'
import { Inter } from 'next/font/google'
import Subtitles from '@/components/subtitles'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className='flex flex-col items-center'>
      <Subtitles/>
    </main>
  )
}
