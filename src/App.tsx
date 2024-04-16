import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadScreen from "@/components/ui/LoadScreen";
import Greetings from "@/components/ui/Greetings";
import Invite from "@/components/ui/Invite";
import "./styles/app.css";

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");
  const [showGreetings, setShowGreetings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);

  const speak = () => {
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(
      "Hi there, welcome to Rayo. Lets make web browsing fun and simple together. You are now on the sign-in page, press enter or space to continue. You can use the Tab key to move to the next field and Shift+Tab to return to the previous field.",
    );
    message.pitch = 2;
    message.rate = 0.8;
    message.lang = "fr-FR";
    window.speechSynthesis.speak(message);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setIsLoading(true);
      const hasBeenGreeted = localStorage.getItem("hasBeenGreeted");
      if (!hasBeenGreeted) {
        const loadingTimer = setTimeout(() => {
          setIsLoading(false);
          setShowGreetings(true);
          if (!speechDone) {
            speak();
            setSpeechDone(true);
            localStorage.setItem("hasBeenGreeted", "true");
          }
        }, 2500); // 2.5 seconds for the loading screen
        return () => clearTimeout(loadingTimer);
      } else {
        setIsLoading(false);
      }
    }
  }, [speechDone, location.pathname]);

  useEffect(() => {
    let greetingsTimer: ReturnType<typeof setTimeout> | undefined;
    if (showGreetings) {
      greetingsTimer = setTimeout(() => {
        setShowGreetings(false);
        setShowInvite(true);
      }, 4000); // Greetings shown for 4 seconds
      return () => clearTimeout(greetingsTimer);
    }
  }, [showGreetings]);

  useEffect(() => {
    if (showInvite) {
      const inviteTimer = setTimeout(() => {
        setShowInvite(false);
      }, 4000); // Invite shown for 4 seconds
      return () => clearTimeout(inviteTimer);
    }
  }, [showInvite]);

  return (
    <div className="app-container">
      {isLoading && <LoadScreen />}
      {showGreetings && <Greetings />}
      {showInvite && <Invite />}
      {!isLoading && !showGreetings && !showInvite && <Outlet />}
    </div>
  );
};

export default App;
