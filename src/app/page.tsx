import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingDown, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-primary">
              Welcome to SpliceMe
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Split Expenses,
            <br />
            Not Friendships
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-balance">
            Easily track and split expenses with friends, roommates, and groups.
            No more awkward conversations about who owes what.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 py-12 sm:py-16">
          <div className="p-4 sm:p-6 rounded-lg bg-card border border-border">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Group Management
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create groups for trips, apartments, or any shared expenses with
              friends.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-lg bg-card border border-border">
            <TrendingDown className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Smart Splitting
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Automatically calculate who owes whom with our intelligent
              splitting algorithm.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-lg bg-card border border-border">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Quick Settlements
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              See exactly how to settle up with minimal transactions between
              friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
