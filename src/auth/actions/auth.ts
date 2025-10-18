"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

//Login
export async function login(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error("Sign in error: ", error.message);
    return {
      status: error?.message,
      user: null,
    };
  }
  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

// Signup
export async function signup({ name, email, password }: SignupInput) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "/",
      data: {
        name: name,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    return {
      status: error?.message,
      user: null,
    };
  } else if (data?.user?.identities?.length === 0) {
    return {
      status: "",
      user: null,
    };
  }

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}
