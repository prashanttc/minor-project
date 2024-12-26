"use client"
import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import { Edit2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
    const pathname = usePathname(); 
  return (
    <aside className='sidebar'>
    <Link href="/" className=' h-[70px] flex items-center justify-center w-full bg-red'>
    <Image src="/assets/icons/z.png" height={10} width={110} alt='logo' className=' ' />
    </Link>
    <nav className='sidebar-nav'>
      <ul className='flex flex-1 flex-col gap-6'>
        {navItems.map(({ url, icon, name }) => {
          return <Link key={name} href={url}>
            <li className={cn("sidebar-nav-item", pathname === url && "shad-active")}>
              <Image src={icon} alt={name} width={24} height={24} className={cn("nav-icon", pathname === url && "nav-icon-active")} />
            </li>
          </Link>
        })}
      </ul>
    </nav>
    <div className='sidebar-user-info'>
      <Image src='/file.svg' height={44} width={44} alt='' className='sidebar-user-avatar' />
      <div className="hidden lg:flex gap-10">
        <div className=''>
          <p className="subtitle-2 capitalize dark:text-white mb-2"></p>
          <p className=" capitalize dark:text-white/80 text-xs w-20"></p>
        </div>
        <Link href='user-profile'>
          <Edit2Icon className='dark:text-brand size-5' />
        </Link>
      </div>
    </div>

  </aside>
  )
}

export default Sidebar
