// App.tsx
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

  useEffect(() => {
    // Timer to simulate the loading process
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowGreetings(true); // Once loading is done, show greetings
    }, 2500); // 2.5 seconds for the loading screen

    // Cleanup function to clear the timer
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    let greetingsTimer: ReturnType<typeof setTimeout>;

    if (showGreetings) {
      // Set a timer to hide the greetings screen after 3 seconds
      greetingsTimer = setTimeout(() => {
        setShowGreetings(false);
        setShowInvite(true); // Show the Invite component after hiding Greetings
      }, 4000); // 4 seconds for the greetings screen
    }

    // Cleanup function to clear the timer
    return () => {
      if (greetingsTimer) {
        clearTimeout(greetingsTimer);
      }
    };
  }, [showGreetings]);

  useEffect(() => {
    if (showInvite) {
      // Set a timer to hide the Invite component after 3 seconds
      const inviteTimer = setTimeout(() => {
        setShowInvite(false);
      }, 4000); // 4 seconds for the Invite screen

      // Cleanup function to clear the timer
      return () => clearTimeout(inviteTimer);
    }
  }, [showInvite]);

  // Render logic based on loading, greeting, and invite states
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
