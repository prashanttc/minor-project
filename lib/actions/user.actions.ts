/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionCLient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { constructAavatarUrl, parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { InputFile } from "node-appwrite/file";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "failed to send OTP");
  }
};

export const createAccount = async ({
  name,
  email,
  semester,
  branch,
}: Createuserprops) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "user already exists" };
    }

    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      return { success: false, error: "failed to send OTP!" };
    }

    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        name,
        email,
        semester,
        branch,
        avatar: avatarPlaceholderUrl,
        accountId,
      }
    );

    return { success: true, accountId };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || "An error occurred while creating the account",
    };
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "failed to verify otp");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionCLient();
    const result = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [result.$id])]
    );

    if (user.total < 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error:any) {
    console.log(error);
  }
};

export const UpdateUser = async ({
  newName,
  semester,
  branch,
  AccountId,
  avatar,
}: {
  newName: string;
  semester: number;
  branch: string;
  AccountId: string;
  avatar: File;
}) => {
  try {
    const { databases } = await createSessionCLient();
    const { storage } = await createAdminClient();
    const inputFiles = InputFile.fromBuffer(avatar, avatar.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.avatarBucketId,
      ID.unique(),
      inputFiles
    );
    const user = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      AccountId,
      {
        name: newName,
        semester: semester,
        branch: branch,
        avatar: constructAavatarUrl(bucketFile.$id),
      }
    );
    return parseStringify(user);
  } catch (error: any) {
    console.log("error occured while updating user", error);
    return {
      success: false,
      error: error.message || "can't update user!",
    };
  }
};

export const SignOutUser = async () => {
  const { account } = await createSessionCLient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "unable to logout");
  } finally {
    redirect("/sign-in");
  }
};

export const SigninUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return { success: false, error: "user does not exist" };
  } catch (error) {
    handleError(error, "Unable to sign in");
    throw error;
  }
};
