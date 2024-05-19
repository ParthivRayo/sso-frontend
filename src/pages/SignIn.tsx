import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { smoothScroll } from "../utils/SmoothScroll";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import MicrosoftLoginButton from "../components/ui/MicrosoftLoginButton";
import Modal from "@/components/ui/Modal"; // Ensure this path is correct

const clientId =
  "276094879389-gsk0c669f2gfpavksl1rn7osa6og7i3t.apps.googleusercontent.com"; // Replace with your actual Google client ID

const SignIn: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false); // Start with false to signify no choice made
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const signInformRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const speechPreference = localStorage.getItem("speechEnabled");
    if (speechPreference === null) {
      setShowModal(true); // Show modal if no preference is stored
    } else {
      setSpeechEnabled(speechPreference === "true");
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("speechEnabled", "false");
    setSpeechEnabled(false);
    setShowModal(false);
  };

  const handleDeny = () => {
    localStorage.setItem("speechEnabled", "true");
    setSpeechEnabled(true);
    setShowModal(false);
  };

  useEffect(() => {
    // When showModal changes to false and speechEnabled is true, focus the signInButton made in such a way that if choosing our speech synthesis then autofocus it to the button
    if (showModal === false) {
      //if we want it to focus no matter what, remove the "&& speechEnabled" or want to make it work only if its enabled, add it
      signInButtonRef.current?.focus();
    }
  }, [showModal]);

  useEffect(() => {
    const verifySession = async () => {
      const idCookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)id\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      if (idCookie) {
        const response = await fetch("http://127.0.0.1:8000/check-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: idCookie }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.logged_in) {
          navigate("/after-login");
        } else {
          navigate("/sign-in");
        }
      } else {
        navigate("/sign-in");
      }
    };

    verifySession();
  }, [navigate]);

  const scrollToSignInform = () => {
    if (signInformRef.current) {
      const scrollTarget = "#signInform"; // CSS selector of the target element
      smoothScroll(scrollTarget, 2000); // You can adjust the duration as needed
    }
  };
  const speakWithDelay = (text: string): void => {
    if ("speechSynthesis" in window && speechEnabled) {
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

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      // Fetching the user profile from Google
      try {
        const userProfileResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!userProfileResponse.ok) {
          throw new Error(
            `Failed to fetch user profile: ${await userProfileResponse.text()}`,
          );
        }

        const userProfile = await userProfileResponse.json();
        console.log("User Profile:", userProfile);

        // Post user profile data or token to your backend
        try {
          const backendResponse = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userProfile.email,
              name: userProfile.name,
              token: accessToken,
            }),
            credentials: "include",
          });

          if (!backendResponse.ok) {
            // First read the response as text to get the error message
            const errorResponse = await backendResponse.text();
            throw new Error(`Backend login failed: ${errorResponse}`);
          }

          // Since the response was ok, read the json body
          const userData = await backendResponse.json();
          console.log("Backend login success:", userData);
          const { id, chat_id } = userData;

          // Store the access_token and chat_id securely
          document.cookie = `id=${id}; path=/`;
          document.cookie = `chat_id=${chat_id}; path=/`;
          document.cookie = `access_token=${accessToken}; path=/`;

          navigate("/after-login");
        } catch (error) {
          console.error("Error communicating with the backend:", error);
        }
      } catch (error) {
        console.error(error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const speak = (text: string): void => {
    if ("speechSynthesis" in window && speechEnabled) {
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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Check if the key pressed is 'Enter' or 'Space'
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      speak("You are now in the sign in form, please use tab to navigate.");
      scrollToSignInform();
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <main
        className="min-h-screen bg-primary-blue"
        aria-labelledby="main-heading"
      >
        {showModal && <Modal onConfirm={handleConfirm} onDeny={handleDeny} />}
        <section
          id="signIn"
          className="container mx-auto flex h-screen flex-col items-center gap-16 py-20"
          aria-labelledby="sign-in-heading"
          aria-describedby="sign-in-description"
        >
          <h1 className="text-8xl font-bold text-white" aria-hidden="true">
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
              aria-label="Sign in button"
              aria-required="true"
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

          <div
            id="arrow"
            className="flex flex-col items-center"
            aria-hidden="true"
          >
            <div className="h-28 w-[2px] bg-white" />
            <div className="-m -mt-4 h-4 w-4 rotate-45 border-[2px] border-l-0 border-t-0 border-white" />
          </div>
        </section>

        <section
          id="signInform"
          ref={signInformRef}
          className="container mx-auto flex h-screen items-center justify-center"
          aria-labelledby="sign-in-form-heading"
        >
          <Card className="max-w-xl flex-1 border-gray-50 p-6">
            <CardHeader>
              <CardTitle
                id="sign-in-form-heading"
                className="text-center text-4xl font-bold text-primary-blue"
              >
                Sign In
              </CardTitle>
            </CardHeader>
            <br></br>
            <CardContent>
              <div id="socialLogin" className="mb-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="xl"
                  className="flex items-center justify-start gap-32 border-gray-50"
                  onMouseEnter={() =>
                    speakWithDelay("Click to sign in with google")
                  }
                  onFocus={() => speak("Press enter to sign in with google")}
                  onClick={() => login()}
                >
                  <img
                    src="/assets/google.png"
                    alt="Google Logo"
                    className="h-6 w-6"
                  />
                  Continue with Google
                </Button>
                <MicrosoftLoginButton />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
