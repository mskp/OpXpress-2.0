"use client";

import { login, signup } from "@/actions/auth";
import BrandIcon from "@/components/misc/brand-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { signupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SignupSchema = z.infer<typeof signupSchema>;

/**
 * Represents the signup component.
 */
export default function SignupComponent(): JSX.Element {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  /**
   * Handles form submission for user signup.
   * @param {Omit<SignupSchema, "confirmPassword">} data - The form data containing user email and password.
   */
  const onSubmit: () => void = handleSubmit(
    async (credentials: Omit<SignupSchema, "confirmPassword">) => {
      const signupResponse = await signup(credentials);

      toast({
        title: signupResponse.message,
        description: "Logging in...",
      });

      if (signupResponse.success) {
        const loginResponse = await login(credentials);

        console.log(loginResponse);
        toast({
          title: loginResponse.message,
        });
        if (loginResponse.success) router.replace("/");
      }
    },
  );

  return (
    <Card className="w-full max-w-sm mx-auto border-none rounded-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="flex justify-center ">
          <BrandIcon isDisabled />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="someone@example.com"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <SignupButton isDisabled={!isValid} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="pt-0 !flex-col">
        <div className="flex justify-center items-center mt-4">
          <p>Already have an account?</p>{" "}
          <Button
            onClick={() => router.replace("/login")}
            variant={"link"}
            className="text-indigo-400 hover:underline"
          >
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function SignupButton({ isDisabled = false }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || isDisabled}
      className="w-full mt-4 rounded-full"
      type="submit"
    >
      {pending ? "Signing up..." : "Signup"}
    </Button>
  );
}
