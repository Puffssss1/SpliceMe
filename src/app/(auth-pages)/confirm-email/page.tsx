"use client";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmailOtpType } from "@supabase/supabase-js";
import { verifyEmail } from "@/auth/actions/auth";

function ConfirmEmail() {
  const [userEmaill, setUserEmail] = useState<string>("");
  const [name, setname] = useState<string>("");
  const searchParam = useSearchParams();
  const token_hash = searchParam.get("token_hash") ?? "";
  const type = searchParam.get("type") as EmailOtpType;
  const user = searchParam.get("user");

  useEffect(() => {
    async function fetchUser() {
      if (user) {
        const decoded = decodeURIComponent(user);
        const clean = decoded.replace(/^map\[|\]$/g, "");

        const userObject: Record<string, string> = {};
        clean.split(" ").forEach((pair) => {
          const [key, value] = pair.split(":");
          userObject[key] = value;
        });
        setUserEmail(userObject.email);
        const firstName = userObject.firstName;
        const lastName = userObject.lastName;
        const fullName = firstName + " " + lastName;
        setname(fullName);
      }
    }
    fetchUser();
  });

  async function handleAction() {
    const result = await verifyEmail(token_hash, type, name, userEmaill);
    console.log(result);
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* body */}
      <div className="relative w-full max-w-md">
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <b>Confirm Email</b>
              </h1>
              <p>Thanks for making your accont with us!</p>
              <p>to confirm your account Just Click the &quot;Confirm&quot; </p>
            </div>
            {/* confirm Password */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="
                  mx-auto 
                  block
                  hover:shadow-xl 
                  transform 
                  hover:scale-105 
                  transition-all
                  duration-300 
                  disabled:opacity-50 
                  disabled:cursor-not-allowed 
                  disabled:transform-none
                  "
                >
                  Confirm Email
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hey <b>{name} </b> is this Email Belongs to you?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    By Clicking the &quot;Continue&quot; you are Confirming that
                    this email: <b>{userEmaill}</b> is yours
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAction}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmEmail;
