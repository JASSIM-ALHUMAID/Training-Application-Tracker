"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { SignOutButton } from "./SignOutButton";
import { useSession } from "@/lib/auth/auth-client";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Briefcase />
          Training Tracker
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {session.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="space-y-1 leading-none tracking-wider">
                      <p>{session.user.name}</p>
                      <p className="text-xs text-muted-foreground ">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
