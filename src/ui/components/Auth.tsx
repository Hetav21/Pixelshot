import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { signUpSchema } from "../schema/signUpSchema";

export function Auth({ type }: { type: "sign-up" | "sign-in" }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const schema = type === "sign-up" ? signUpSchema : signInSchema;

  type FormSchema = typeof schema;
  type FormData = z.infer<FormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      let res: ApiResponse;
      if (type == "sign-in") {
        res = await window.electronAPI.signIn({
          username: values.username,
          password: values.password,
        });
      } else {
        res = await window.electronAPI.signUp({
          username: values.username,
          password: values.password,
        });
      }

      if (res.success == false) {
        toast.warning(
          `An error occurred while ${type == "sign-in" ? "signing in" : "signing up"}`,
          { description: res.message },
        );
        return;
      }

      Cookies.set("id", res.info!.username!);

      toast.success("Logged in successfully!");

      navigate("/dashboard");
    } catch (e: unknown) {
      toast.warning(
        `An unknown error occurred while ${type === "sign-in" ? "signing in" : "signing up"}`,
      );
      return;
    }
  }

  return (
    <div className="h-screen flex justify-content flex-col">
      <div className="h-screen flex justify-center place-items-center">
        <div>
          <div className="px-10 mb-2">
            <div className="text-3xl font-extrabold">Create an account</div>
            <div className="text-slate-400">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "sign-in" ? "/sign-up" : "/sign-in"}
              >
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                {type === "sign-in" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
