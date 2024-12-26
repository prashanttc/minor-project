/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const createQueries = ( searchText:string , sort:string , limit?:number) => {
  const queries = [];

  if (searchText) queries.push(Query.contains("title" , searchText)) 
  if (limit) queries.push(Query.limit(limit))
    const[sortby , orderby] = sort.split("-");
  queries.push(
    orderby ==="asc"?Query.orderAsc(sortby):Query.orderDesc(sortby)
  ) 
  return queries;
};


export const getAllBooks = async ({ searchText='' , sort='$createdAt-desc', limit}:GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const queries = createQueries(searchText ,sort ,limit);
    const books = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookCollectionId,
      queries
    );

    return parseStringify(books);
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "An error occurred fetching the books",
    };
  }
};
