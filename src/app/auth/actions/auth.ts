"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { headers } from "next/headers";

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

// Signout
export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

// Verify email
export async function verifyEmail(
  token_hash: string,
  type: EmailOtpType,
  email: string,
  name: string
) {
  if (!token_hash || !type) {
    redirect("/error");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    console.error("OTP Verification Error:", error.message);
    redirect("/error");
  }

  const user = data?.user;
  if (!user) {
    console.error("No user returned after OTP verification");
    redirect("/error");
  }

  // Check if usre already exists
  const { data: existingUser } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!existingUser) {
    const { error: insertError } = await supabase.from("user_profile").insert({
      id: user.id,
      email: user.email,
      name,
    });

    if (insertError) {
      console.error("Insert user_profile error:", insertError.message);
      redirect("/error");
    }
  }

  redirect("/login");
}

// SigninwithGoogle
export async function signinWithGoogle() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const auth_callback_url = `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: auth_callback_url,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  } else if (data.url) {
    return redirect(data.url);
  }
}
