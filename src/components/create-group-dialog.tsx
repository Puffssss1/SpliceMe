"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // get the currently user
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  // Create a group and add the creator as a member
  const handleCreate = async () => {
    if (!name.trim() || !user) return;

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { data: newGroup, error: groupError } = await supabase
        .from("groups")
        .insert([
          {
            name,
            description,
            owner_id: user.id,
          },
        ])
        .select()
        .single();

      if (groupError) throw groupError;

      // Add the creator to group_members
      const { error: memberError } = await supabase
        .from("group_members")
        .insert([
          {
            group_id: newGroup.id,
            user_id: user.id,
          },
        ]);

      if (memberError) throw memberError;

      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating group:", (error as Error).message);
      alert("Failed to create group: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Group
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group to start splitting expenses
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading user...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Group Name
              </label>
              <Input
                placeholder="e.g., Weekend Trip"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Description (optional)
              </label>
              <Input
                placeholder="e.g., Trip to Bali"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
