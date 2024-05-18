import { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import MainContent from "../components/ui/MainContent";
import Footer from "../components/ui/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AfterLogin() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Get the theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [speechEnabled] = useState(() => {
    // Initialize speechEnabled based on stored preference
    const savedPreference = localStorage.getItem("speechEnabled");
    return savedPreference === "true";
  });

  // Update the localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  useEffect(() => {
    // Only speak on mount if speech is enabled
    if (speechEnabled) {
      speak(
        "Welcome to the chatbot, press tab and shift+tab to navigate and Press escape for help.",
      );
    }
  }, [speechEnabled]);

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

  const handleAddFile = (fileUrl: string) => {
    setSelectedFile(fileUrl);
  };
  const navigate = useNavigate();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

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

  const handleAskCommand = async (question: string, pageNumber?: number) => {
    const chatId = getCookie("chat_id");
    if (!chatId) {
      console.error("Chat ID is missing from cookies.");
      setChatResponse(
        "No valid session found. Please ensure you are logged in.",
      );
      return;
    }

    setChatQuestion(question);
    setShowChatbox(true);

    try {
      const apiUrl =
        pageNumber !== undefined && pageNumber !== -1
          ? `http://172.210.57.85/api/chat_with_page_number?user_id=${chatId}&user_query=${encodeURIComponent(question)}&page_number=${pageNumber}`
          : `http://172.210.57.85/api/chat_without_info?user_id=${chatId}&user_query=${encodeURIComponent(question)}`;

      console.log("API URL:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          accept: "application/json",
        },
      });

      if (response.status === 200 && response.data && response.data.Response) {
        setChatResponse(response.data.Response);
      } else {
        console.error("Invalid response data:", response.data);
        setChatResponse("Failed to get a valid response from the server.");
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setChatResponse("Failed to communicate with the chat service.");
    }
  };

  const closeChatbox = () => {
    setShowChatbox(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`flex h-screen flex-col ${darkMode ? "dark" : ""}`}>
      <Header
        onAddFile={handleAddFile}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        onAskCommand={handleAskCommand}
      />
      <MainContent
        file={selectedFile}
        showChatbox={showChatbox}
        question={chatQuestion}
        response={chatResponse}
        onCloseChatbox={closeChatbox}
      />
      <Footer />
    </div>
  );
}

export default AfterLogin;
