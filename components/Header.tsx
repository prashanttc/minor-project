'use client'

import React, { useState, useEffect } from 'react'
import Searchbox from './Searchbox'
import { getCurrentUser } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageName } from '@/lib/utils'

const Header = () => {
  const [userdetails, setUserdetails] = useState<{ name: string; avatar: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUserdetails(user);
    };
    fetchUser();
  }, []);

  return (
    <header className="header">
      <h1 className='font-bold text-2xl'>{getPageName(pathname)}</h1>
      <Searchbox />
      <div className="flex gap-4 items-center">
        {userdetails ? (
          <>
            <h1 className="user-detail-name">{userdetails.name}</h1>
            <Image
              src={userdetails.avatar}
              height={32}
              width={32}
              className="user-detail-profile"
              alt="profile"
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </header>
  );
}

export default Header;
