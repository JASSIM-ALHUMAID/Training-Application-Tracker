"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();
  return (
    <DropdownMenuItem
      onClick={async () => {
        const result = await signOut();
        if (result) {
          router.push("/sign-in");
        } else {
          alert("Error signing out. Please try again.");
        }
      }}
    >
      Log Out
    </DropdownMenuItem>
  );
};
