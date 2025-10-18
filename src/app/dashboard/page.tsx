import React from "react";
import Logout from "@/components/logout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/login");
  }

  return (
    <>
      <div>Welcome back!</div>
      <Logout />
    </>
  );
}

export default Dashboard;
