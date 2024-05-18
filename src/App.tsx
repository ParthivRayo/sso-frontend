import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadScreen from "@/components/ui/LoadScreen";
import Greetings from "@/components/ui/Greetings";
import Invite from "@/components/ui/Invite";
import useHasBeenGreeted from "@/hooks/useHasBeenGreeted";
import "./styles/app.css";
import "@babel/polyfill";

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");
  const [showGreetings, setShowGreetings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [hasBeenGreeted, markAsGreeted] = useHasBeenGreeted();

  useEffect(() => {
    if (location.pathname === "/" && !hasBeenGreeted) {
      setIsLoading(true);
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setShowGreetings(true);
        speak();
        markAsGreeted();
      }, 2500);
      return () => clearTimeout(loadingTimer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, hasBeenGreeted, markAsGreeted]);

  useEffect(() => {
    let greetingsTimer: ReturnType<typeof setTimeout>;
    if (showGreetings) {
      greetingsTimer = setTimeout(() => {
        setShowGreetings(false);
        setShowInvite(true);
      }, 4000);
      return () => clearTimeout(greetingsTimer);
    }
  }, [showGreetings]);

  useEffect(() => {
    let inviteTimer: ReturnType<typeof setTimeout>;
    if (showInvite) {
      inviteTimer = setTimeout(() => {
        setShowInvite(false);
      }, 4000);
      return () => clearTimeout(inviteTimer);
    }
  }, [showInvite]);

  const speak = () => {
    if ("speechSynthesis" in window) {
      const message = new SpeechSynthesisUtterance(
        "Hi there, welcome to Rayo. Let's make web browsing fun and simple together.", // You are now on the sign-in page, press enter or space to continue. You can use the Tab key to move to the next field and Shift+Tab to return to the previous field.
      );
      //message.pitch = 2;
      message.rate = 0.8;
      message.lang = "fr-FR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(message);
    } else {
      console.error("Your browser does not support speech synthesis.");
    }
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
