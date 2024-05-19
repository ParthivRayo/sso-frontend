import { useState, useEffect, useCallback } from "react";
import Header from "../components/ui/Header";
import MainContent from "../components/ui/MainContent";
import Footer from "../components/ui/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AfterLogin() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // New state for image URL
  const [imageDescription, setImageDescription] = useState<string | undefined>(
    undefined,
  ); // New state for image description
  const [isImage, setIsImage] = useState<boolean>(false); // New state to indicate if the content is an image
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
    setImageUrl(undefined); // Clear image state if file is uploaded
    setImageDescription(undefined); // Clear image description state if file is uploaded
    setIsImage(false); // Set isImage to false for PDF
  };

  const handleAddImage = (imageUrl: string, description: string) => {
    setImageUrl(imageUrl);
    setImageDescription(description);
    setSelectedFile(null); // Clear file state if image is uploaded
    setChatResponse(description); // Directly set the chat response to the image description
    setShowChatbox(true); // Show chatbox when image is uploaded
    setIsImage(true); // Set isImage to true for images
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

  const handleEscapeKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowChatbox(false);
      speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      window.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [handleEscapeKeyPress]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        setImageUrl(url); // Display the image immediately
        setIsImage(true); // Set isImage to true for images

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post(
          "http://172.210.57.85/api/create_description_of_image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (uploadResponse.status === 200) {
          const { Response } = uploadResponse.data;
          console.log(imageDescription);
          handleAddImage(url, Response);
        } else {
          console.error("Image upload failed:", uploadResponse.status);
        }
      } else if (fileType === "application/pdf") {
        setImageUrl(undefined); // Clear image state if PDF is uploaded
        setIsImage(false); // Set isImage to false for PDFs
        handleAddFile(url);

        const formData = new FormData();
        formData.append("file", file);

        const fileName = file.name;
        console.log(fileName); // Log the fileName to the console

        // Retrieve chat_id from cookies
        const cookies = document.cookie.split(";").reduce(
          (acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key.trim()] = value.trim();
            return acc;
          },
          {} as Record<string, string>,
        );

        const chatId = cookies["chat_id"];
        if (!chatId) {
          console.error("chat_id not found in cookies");
          return;
        }

        // Construct the URL with the chat_id as userid
        const requestUrl = `http://172.210.57.85/api/ingest_pdf_with_metadata?userid=${chatId}`;

        const uploadResponse = await axios.post(requestUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.status === 200) {
          console.log("File uploaded successfully:", uploadResponse.data);
        } else {
          console.error(
            "File upload failed:",
            uploadResponse.status,
            uploadResponse.data,
          );
        }
      } else {
        alert("Unsupported file type. Please upload a PDF or image file.");
      }
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Error processing file: " + error);
    }
  };

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
      setChatResponse(
        "This request is invalid. Please try again with an appropriate query",
      );
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
        onAddImage={handleAddImage}
        showChatbox={showChatbox} // Pass this prop
        chatResponse={chatResponse} // Pass this prop
        setShowChatbox={setShowChatbox} // Pass this prop
      />
      <MainContent
        file={selectedFile}
        showChatbox={showChatbox}
        question={chatQuestion}
        response={chatResponse}
        onCloseChatbox={closeChatbox}
        onFileSelect={handleFileSelect}
        imageUrl={imageUrl} // Pass new state
        isImage={isImage} // Pass new state to indicate if it's an image
      />
      <Footer />
    </div>
  );
}

export default AfterLogin;
