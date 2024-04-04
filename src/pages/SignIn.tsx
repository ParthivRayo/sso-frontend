import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FC } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const SignIn: FC = () => {
  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <main className="min-h-screen bg-primary-blue">
      <section
        id="signIn"
        className="container mx-auto flex h-screen flex-col items-center gap-16 py-20"
      >
        <h1 className="text-8xl font-bold text-white">
          Sign In
          <br />
          to Get Started!
        </h1>
        <a
          href="#signInform"
          className={cn(
            buttonVariants({
              variant: "pink",
              size: "xl",
            }),
            "w-40 rounded-full text-lg",
          )}
        >
          Sign In
        </a>

        <div id="arrow" className="flex flex-col items-center">
          <div className="h-28 w-[2px] bg-white" />
          <div className="-m -mt-4 h-4 w-4 rotate-45 border-[2px] border-l-0 border-t-0 border-white" />
        </div>
      </section>

      <section
        id="signInform"
        className="container mx-auto flex h-screen items-center justify-center"
      >
        <Card className="max-w-xl flex-1 p-6">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold text-primary-blue">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div id="socialLogin" className="mb-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="xl"
                className="flex items-center justify-start gap-32"
              >
                <img
                  src="/assets/google.png"
                  alt="Google Logo"
                  className="h-6 w-6"
                />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="flex items-center justify-start gap-[120px]"
              >
                <img
                  src="/assets/microsoft.png"
                  alt="Microsoft Logo"
                  className="h-6 w-6"
                />
                Continue with Microsoft
              </Button>
            </div>

            <div className="mb-2 mt-4 flex items-center justify-center gap-4">
              <hr className="h-1 w-full" />
              <span>OR</span>
              <hr className="h-1 w-full" />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email"
                          className="border-2 border-primary-blue border-opacity-25 focus:border-opacity-100 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="Password"
                          className="border-2 border-primary-blue border-opacity-25 focus:border-opacity-100 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="my-2 flex gap-2">
                  <Checkbox id="terms" />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember Me
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="pink"
                  size="xl"
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </Form>

            <div className="mt-4 flex justify-center gap-2 text-center">
              <Link to="/sign-up" className="font-semibold underline">
                Register
              </Link>
              <div className="w-[1px] bg-black" />
              <a href="#" className="hover:underline">
                Forgot Password
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default SignIn;
