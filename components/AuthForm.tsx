/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import CustomInput from "./CustomInput";
import { AuthformSchema } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { createAccount, SigninUser } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { branches, semesters } from "@/constants";

type Props = {
  type: "sign-in" | "sign-up"
}

const AuthForm = ({ type }: Props) => {

  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = AuthformSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      semester: "",
      branch: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setErrorMessage("");
    setAccountId(undefined);
    try {
      const userResponse =
        type === "sign-up"
          ? await createAccount({
            name: values.name || "",
            email: values.email,
            semester: values.semester || "",
            branch: values.branch || ""

          })
          : await SigninUser({ email: values.email });
      setAccountId(userResponse.accountId);
      const error = userResponse.error;
      if (error) {
        if (error === "user already exists") {
          setErrorMessage("The account already exists. Please sign in.");
        } else if (error === "failed to send OTP!") {
          setErrorMessage("Failed to send OTP. Please try again later.");
        } else if (error === "user does not exist") {
          setErrorMessage("user does not exist . please create account.");
        } else {
          setErrorMessage("Failed to sign in. Please try again later.");
        }
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">{type === "sign-in" ? "Sign-In" : "Sign-Up"}</h1>
          {type === "sign-up" && <>
            <CustomInput control={form.control} name='name' placeholder="enter your name" label="name" />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[100%]">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.value} value={branch.value}>
                              {branch.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="shad-from-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[100%]">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester.value} value={semester.value}>
                              {semester.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="shad-from-message" />
                </FormItem>
              )}
            />

          </>}
          <CustomInput control={form.control} name='email' placeholder="enter your email" label="email" />

          <Button type="submit" className="form-submit-button" disabled={loading}>
            {type === "sign-in" ? "sign-in" : "sign-up"}
            {loading && (
              <Image src="/assets/icons/loader.svg" height={24} width={24} alt="" />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100"> {type === "sign-in" ? "don't have an account?" : "already have an account?"}</p>
            <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="ml-1 text-brand font-medium">{type === "sign-in" ? "Signup" : "Signin"}</Link>
          </div>
        </form>
      </Form>
      {accountId && <OTPModal email={form.getValues("email")} accountId={accountId} />}
    </>
  )
}

export default AuthForm
