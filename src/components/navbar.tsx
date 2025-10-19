"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import Logout from "@/components/logout";

export function Navbar() {
  //   const { currentUser, setCurrentUser, isLoggedIn } = useApp();

  const handleLogout = () => {
    // setCurrentUser(null);
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">SpliceMe</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* {isLoggedIn && currentUser && ( */}
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {/* {currentUser.name} */}
              </span>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              {/* <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button> */}
              <Logout />
            </>
            {/* )} */}
          </div>
        </div>
      </div>
    </nav>
  );
}
