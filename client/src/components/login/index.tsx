"use client";

import { login } from "@/actions/auth";
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
import { loginSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Represents the login component
 */
export default function LoginComponent(): JSX.Element {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Handles form submission for user login.
   */
  const onSubmit: () => void = handleSubmit(
    async (credentials: LoginSchema) => {
      const { message, success } = await login(credentials);

      toast({
        title: message,
      });

      if (success) router.replace("/");
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
            <LoginButton isDisabled={!isValid} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="pt-0 !flex-col">
        <div className="flex justify-center items-center mt-4">
          <p>Dont have an account?</p>
          <Button
            onClick={() => router.replace("/signup")}
            variant={"link"}
            className="text-indigo-400 hover:underline"
          >
            Signup
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function LoginButton({ isDisabled = false }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending || isDisabled}
      className="w-full mt-4 rounded-full"
      type="submit"
    >
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}
