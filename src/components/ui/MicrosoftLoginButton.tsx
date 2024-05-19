import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../lib/authConfig";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const MicrosoftLoginButton = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const speakWithDelay = (text: string): void => {
    if ("speechSynthesis" in window) {
      // Create a new utterance for the provided text
      const utterance = new SpeechSynthesisUtterance(text);

      // Set the properties of the utterance
      utterance.pitch = 2; // Higher pitch
      utterance.rate = 0.8; // Slower rate of speech
      //utterance.lang = "fr-FR"; // French language

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
      //utterance.lang = "fr-FR"; // French language

      // Cancel any previously scheduled speech to avoid overlaps
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance); // Speak after a 100ms delay
    } else {
      // Log an error message if speech synthesis is not supported
      console.error("Your browser does not support speech synthesis.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log("Response:", response);

      // Check if the response contains an account
      if (response?.account) {
        const account = response.account;
        const accessToken = response.accessToken;
        const user = account.idTokenClaims as {
          name: string;
          preferred_username: string;
        };
        const { name, preferred_username: email } = user;

        // Send user data to the backend
        const backendResponse = await fetch(
          "http://127.0.0.1:8000/loginmicrosoft",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, token: accessToken }),
            credentials: "include",
          },
        );

        if (!backendResponse.ok) {
          const errorResponse = await backendResponse.text();
          throw new Error(`Backend login failed: ${errorResponse}`);
        }

        const userData = await backendResponse.json();
        console.log("Backend login success:", userData);
        const { id, chat_id } = userData;

        // Store the access_token and chat_id securely
        document.cookie = `id=${id}; path=/`;
        document.cookie = `chat_id=${chat_id}; path=/`;

        navigate("/after-login");
      } else {
        console.error("No account found in the response");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      size="xl"
      className="flex items-center justify-start gap-[120px] border-gray-50"
      onMouseEnter={() => speakWithDelay("Click to sign in with microsoft")}
      onFocus={() => speak("Press enter to sign in with microsoft")}
      onClick={handleLogin}
    >
      <img
        src="/assets/microsoft.png"
        alt="Microsoft Logo"
        className="h-6 w-6"
      />
      Continue with Microsoft
    </Button>
  );
};

export default MicrosoftLoginButton;
