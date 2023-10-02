import './globals.css'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { BsFillPersonFill } from 'react-icons/bs'

import { FaWineBottle } from 'react-icons/fa'
import { FiHome } from 'react-icons/fi'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gerenciamento comercial',
  description: 'Gerenciamento comercial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="text-gray-700 bg-green-500 w-full">
      <nav className="bg-green-700 p-4 text-white flex text-center justify-center">
      <Link href="/">
          <p className="hover:bg-green-600 mx-2 py-2 px-4 rounded-full flex items-center gap-1"><FiHome size={25}/>Home</p>
        </Link>
        <Link href="/produtos">
          <p className="hover:bg-green-600 mx-2 py-2 px-4 rounded-full flex items-center gap-1"><FaWineBottle size={25}/>Produtos</p>
        </Link>
        <Link href="/clientes">
          <p className="hover:bg-green-600 mx-2 py-2 px-4 rounded-full flex items-center gap-1"><BsFillPersonFill size={25}/>Clientes</p>
        </Link>
        <Link href="/pedidos">
          <p className="hover:bg-green-600 mx-2 py-2 px-4 rounded-full flex items-center gap-1"><AiOutlineShoppingCart size={25}/>Pedidos</p>
        </Link>
      </nav>
      </div>
        {children}
        </body>
    </html>
  )
}
