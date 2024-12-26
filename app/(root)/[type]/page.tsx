
import Sort from '@/components/Sort';
import { getAllBooks } from '@/lib/actions/book.actions';
import { Models } from 'node-appwrite';
import React from 'react'

const page = async ({ params ,searchParams }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) ||"";
    const sort = ((await searchParams)?.sort as string) ||"";
    const books = await getAllBooks({sort,searchText});
    return (
        <div className='page-container'>
            <section className='w-full'>
                <h1 className='h1 capitalize'>{type}</h1>
                <div className='total-size-section'>
                    <p className='body-1'>
                    </p>
                    <div className='sort-container'>
                        <p className='body-1 hidden sm:block text-light-200'> Sort by:</p>
                        <Sort />
                    </div>
                </div>
                <section>
                </section>
            </section>
            {books.total > 0 ? (
                <section className='file-list'>
                    {books.documents.map((book: Models.Document) => (
                        <div className='' key={book.$id}>
                            <h1>{book.author}</h1>
                            <h1>{book.title}</h1>
                            <h1>{book.genre}</h1>
                            <h1>{book.isbn}</h1>
                        </div>
                    ))}
                </section>
            ) : <p className='empty-list'> no file uploaded</p>}
        </div>
    )
}

export default page