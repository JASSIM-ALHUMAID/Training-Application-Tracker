"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="flex min-h-[calc(80vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-black font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form action="" className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email:
              </Label>
              <Input
                className="hover:border-primary/50"
                id="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password:
              </Label>
              <Input
                className="hover:border-primary/50"
                id="password"
                type="password"
                placeholder=""
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-4">
            <Button type="submit" className="w-full">
              Sign In{" "}
            </Button>
            <p>
              Don't have an Account?{" "}
              <Link className="text-primary" href="/sign-up">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
