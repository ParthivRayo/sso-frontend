import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LoadScreen from "@/components/ui/LoadScreen";
import Greetings from "@/components/ui/Greetings";
import Invite from "@/components/ui/Invite";
import "./styles/app.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showGreetings, setShowGreetings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowGreetings(true);
      if (!speechDone) {
        speak();
        setSpeechDone(true);
      }
    }, 2500); // 2.5 seconds for the loading screen

    return () => clearTimeout(loadingTimer);
  }, [speechDone]);

  useEffect(() => {
    let greetingsTimer: ReturnType<typeof setTimeout> | undefined;
    if (showGreetings) {
      greetingsTimer = setTimeout(() => {
        setShowGreetings(false);
        setShowInvite(true);
      }, 4000); // Greetings shown for 4 seconds
    }

    // Return a cleanup function that will clear the timeout
    return () => {
      if (greetingsTimer) {
        clearTimeout(greetingsTimer);
      }
    };
  }, [showGreetings]);

  useEffect(() => {
    if (showInvite) {
      const inviteTimer = setTimeout(() => {
        setShowInvite(false);
      }, 4000); // Invite shown for 4 seconds

      return () => clearTimeout(inviteTimer);
    }
  }, [showInvite]);

  const speak = () => {
    const message = new SpeechSynthesisUtterance(
      "Hi there, welcome to Rayo. Lets make web browsing fun and simple together",
    );
    message.pitch = 2;
    message.rate = 0.7;
    //message.lang = "fr-FR"; #use rate 0.8 for this
    window.speechSynthesis.speak(message);
  };

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
