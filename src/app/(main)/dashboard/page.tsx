"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { CreateGroupDialog } from "@/components/create-group-dialog";
import { GroupCard } from "@/components/group-card";
import type { Group } from "@/lib/types";

function Dashboard() {
  const [user, setUser] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      //Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        redirect("/login");
        return;
      }

      setUser(user.user_metadata.name);

      //get user groups
      const { data: userGroups, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("owner_id", user.id);

      if (groupError) {
        console.error("Error fetching groups:", groupError.message);
      } else {
        setGroups(userGroups || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading...</p>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
              Welcome, {user}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your groups and expenses
            </p>
          </div>
          <CreateGroupDialog />
        </div>

        {/* Groups Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
            Your Groups
          </h2>
          {groups.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                No groups yet. Create one to get started!
              </p>
              <CreateGroupDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
