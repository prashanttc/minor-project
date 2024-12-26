/* eslint-disable no-unused-vars */

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}
 declare interface Createuserprops {
  name:string;
  email:string;
  semester:string;
  branch:string;
 }
 declare interface GetFilesProps {
  searchText?: string;
  sort?: string;
  limit?: number;
}