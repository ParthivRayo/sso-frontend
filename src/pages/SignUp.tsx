import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FC, useEffect } from "react";
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
//import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const SignUp: FC = () => {
  const formSchema = z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(
      "You are in the sign up page now, press tab to navigate and remember, you can use the Tab key to move to the next field and Shift+Tab to return to the previous field.",
    );
    message.pitch = 2; // Sets the pitch of the voice
    message.rate = 0.8; // Sets the speed at which the message is spoken
    message.lang = "fr-FR"; // Sets the language of the voice to French (France)

    window.speechSynthesis.speak(message);
  }, []);

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <main className="min-h-screen bg-primary-blue">
      <section
        id="signInform"
        className="container mx-auto flex h-screen items-center justify-center"
      >
        <Card className="max-w-xl flex-1 p-6">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold text-primary-blue">
              Sign UP
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your email")
                          }
                          onFocus={() => speak("Enter your email")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your first name"
                          className="border-2 border-primary-blue border-opacity-25 focus:border-opacity-100 focus-visible:ring-0"
                          {...field}
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your first name")
                          }
                          onFocus={() => speak("Enter your first name")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your last name"
                          className="border-2 border-primary-blue border-opacity-25 focus:border-opacity-100 focus-visible:ring-0"
                          {...field}
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your last name")
                          }
                          onFocus={() => speak("Enter your last name")}
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
                          onMouseEnter={() =>
                            speakWithDelay("Click to enter your password")
                          }
                          onFocus={() => speak("Enter your password")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          className="border-2 border-primary-blue border-opacity-25 focus:border-opacity-100 focus-visible:ring-0"
                          {...field}
                          onMouseEnter={() =>
                            speakWithDelay("Click to confirm your password")
                          }
                          onFocus={() =>
                            speak("Enter your password again for confirmation")
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="my-2 flex gap-2">
                  <Checkbox
                    id="terms"
                    onFocus={() =>
                      speak("Press space to accept the terms and conditions")
                    }
                    onMouseEnter={() =>
                      speakWithDelay("Click to accept the terms and conditions")
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept
                    <a
                      href="#"
                      className="ml-1 font-semibold text-primary-blue"
                      onMouseEnter={() =>
                        speakWithDelay("Click to open terms and conditions")
                      }
                      onFocus={() =>
                        speak("Press Enter to open terms and conditions")
                      }
                    >
                      Terms & Conditions
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="pink"
                  size="xl"
                  className="w-full"
                  onMouseEnter={() =>
                    speakWithDelay("Click to register with us")
                  }
                  onFocus={() => speak("Press enter to register with us")}
                >
                  Continue
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Link
                to="/sign-in"
                className="hover:underline"
                onMouseEnter={() =>
                  speakWithDelay("Click to go back to sign in")
                }
                onFocus={() => speak("Press enter to go back to sign in")}
                onClick={() =>
                  speak(
                    "You are being redirected to the sign in page, press tab to navigate",
                  )
                }
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default SignUp;
