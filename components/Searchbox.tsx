'use client';
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAllBooks } from '@/lib/actions/book.actions';
import { useDebounce } from "use-debounce";
import { Models } from 'node-appwrite';
import { SearchIcon } from 'lucide-react';

const Searchbox = () => {
  const [query, setQuery] = useState("")
  const searchParam = useSearchParams();
  const [result, setResult] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const searchQuery = searchParam.get("query");
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300)

  const handleclick = () => {
    setOpen(false);
    setResult([]);
    router.push(`/allbooks?query=${query}`)
  }
  useEffect(() => {
    const fetchBook = async () => {
      if (debouncedQuery.length === 0) {
        setResult([]);
        setOpen(false);
        return router.push(path.replace(searchParam.toString(), ""))
      }
      const books = await getAllBooks({ searchText: debouncedQuery })
      setResult(books.documents)
      setOpen(true)
    }
    fetchBook();

  }, [debouncedQuery])

  useEffect(() => {
    if (!searchQuery) {
      setQuery("")
    }
  }, [searchQuery])
  return (
    <div className='search'>
      <div className='search-input-wrapper dark:border-[1px] dark:border-white'>
        <SearchIcon />
        <Input placeholder='Search any book' value={query} className='search-input' onChange={(e) => setQuery(e.target.value)} />
        {open && (
          <ul className='search-result'>
            {result.length > 0 ? (
              result.map((file) => (
                <li key={file.$id} className='flex items-center ' onClick={() => handleclick()}>
                  <div className='cursor-pointer flex justify-center h-fit items-center gap-4 '>
                    <div> {file.title}</div>
                    <p className='subtitle-2 line-clamp-1 text-light-100 dark:text-white'>{file.name}</p>
                  </div>
                </li>
              ))
            ) : <li className='empty-result'> no file found</li>
            }
          </ul>
        )}
      </div>

    </div>
  )
}

export default Searchbox
