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
import { useState, useEffect, useRef } from "react";
import { smoothScroll } from "../utils/SmoothScroll";

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
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const signInformRef = useRef<HTMLDivElement>(null); // Reference to the sign-in form section
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);

  useEffect(() => {
    // Automatically focus the button when the component mounts
    if (signInButtonRef.current) {
      signInButtonRef.current.focus();
    }
  }, []);

  const scrollToSignInform = () => {
    if (signInformRef.current) {
      const scrollTarget = "#signInform"; // CSS selector of the target element
      smoothScroll(scrollTarget, 2000); // You can adjust the duration as needed
    }
  };
  const speakWithDelay = (text: string): void => {
    if ("speechSynthesis" in window) {
      // Create a new utterance for the provided text
      const utterance = new SpeechSynthesisUtterance(text);

      // Set the properties of the utterance
      utterance.pitch = 2; // Higher pitch
      utterance.rate = 0.8; // Slower rate of speech
      utterance.lang = "fr-FR"; // French language

      // Cancel any previously scheduled speech to avoid overlaps
      speechSynthesis.cancel();

      // Delay the speech synthesis
      setTimeout(() => {
        speechSynthesis.speak(utterance); // Speak after a 100ms delay
      }, 100);
    } else {
      // Log an error message if speech synthesis is not supported
      console.error("Your browser does not support speech synthesis.");
    }
  };
  const speak = (text: string): void => {
    if ("speechSynthesis" in window) {
      // Create a new utterance for the provided text
      const utterance = new SpeechSynthesisUtterance(text);

      // Set the properties of the utterance
      utterance.pitch = 2; // Higher pitch
      utterance.rate = 0.8; // Slower rate of speech
      utterance.lang = "fr-FR"; // French language

      // Cancel any previously scheduled speech to avoid overlaps
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance); // Speak after a 100ms delay
    } else {
      // Log an error message if speech synthesis is not supported
      console.error("Your browser does not support speech synthesis.");
    }
  };

  const toggleRememberMe = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
    speak(`Toggled remember me ${isRememberMeChecked ? "off" : "on"}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Check if the key pressed is 'Enter' or 'Space'
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      speak("You are now in the sign in form, please use tab to navigate.");
      scrollToSignInform();
    }
  };

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
        <Link to="/sign-in">
          <button
            className={cn(
              buttonVariants({
                variant: "pink",
                size: "xl",
              }),
              "w-40 rounded-full text-lg",
            )}
            ref={signInButtonRef}
            onKeyPress={handleKeyPress}
            onMouseEnter={() => speakWithDelay("Click to go to sign in form")}
            onFocus={() =>
              speak(
                "You are in the sign in page, press space to go to sign in form and continue. You can use the Tab key to move to the next field and Shift+Tab to return to the previous field.",
              )
            }
            onClick={() => {
              speak(
                "You are now in the sign in form, please use tab to navigate.",
              );
              scrollToSignInform();
            }}
          >
            Sign In
          </button>
        </Link>

        <div id="arrow" className="flex flex-col items-center">
          <div className="h-28 w-[2px] bg-white" />
          <div className="-m -mt-4 h-4 w-4 rotate-45 border-[2px] border-l-0 border-t-0 border-white" />
        </div>
      </section>

      <section
        id="signInform"
        ref={signInformRef}
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
                onMouseEnter={() =>
                  speakWithDelay("Click to sign in with google")
                }
                onFocus={() => speak("Press enter to sign in with google")}
                onClick={() => speak("Signing in with google")}
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
                onMouseEnter={() =>
                  speakWithDelay("Click to sign in with microsoft")
                }
                onFocus={() => speak("Press enter to sign in with microsoft")}
                onClick={() => speak("Signing in with microsoft")}
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
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your email")
                          }
                          onFocus={() => speak("Enter your email")}
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
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your password")
                          }
                          onFocus={() => speak("Enter your password")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="my-2 flex gap-2">
                  <Checkbox
                    id="terms"
                    onMouseEnter={() =>
                      speakWithDelay("Click to activate the Remember Me option")
                    }
                    onFocus={() =>
                      speak("Press space to select the Remember Me checkbox")
                    }
                    onClick={toggleRememberMe}
                    checked={isRememberMeChecked}
                  />
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
                  onMouseEnter={() => speakWithDelay("Click to login")}
                  onFocus={() => speak("Press enter to login")}
                  onClick={() => speak("Logging in")}
                >
                  Continue
                </Button>
              </form>
            </Form>

            <div className="mt-4 flex justify-center gap-2 text-center">
              <Link
                to="/sign-up"
                className="font-semibold underline"
                onMouseEnter={() => speakWithDelay("Click to go to sign up")}
                onFocus={() => speak("Press enter to go to sign up")}
                onClick={() => speak("Going to registration")}
              >
                Register
              </Link>
              <div className="w-[1px] bg-black" />
              <a
                href="#"
                className="hover:underline"
                onMouseEnter={() =>
                  speakWithDelay("Click to recover your account password")
                }
                onFocus={() => speak("Press enter to reset your password")}
                onClick={() => speak("Resetting your password")}
              >
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
