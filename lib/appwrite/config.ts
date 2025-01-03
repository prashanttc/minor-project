export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION!,
  transactionCollectionId:process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION!,
  bookCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BOOK_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  avatarBucketId: process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_SECRET_KEY!,
};
