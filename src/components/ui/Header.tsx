import {
  useState,
  FC,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import microphoneIcon from "/assets/mic.png";
import scannerIcon from "/assets/scanner.png";
import "@/styles/header.css";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "@/styles/toast.css";

interface HeaderProps {
  onAddFile: (file: string) => void;
  toggleDarkMode: () => void;
  darkMode: boolean;
  onAskCommand: (question: string, pageNumber: number) => void;
  onAddImage: (imageUrl: string, description: string) => void;
  showChatbox: boolean; // Add this prop
  chatResponse: string; // Add this prop
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>; // Add this prop
}

const Header: FC<HeaderProps> = ({
  onAddFile,
  toggleDarkMode,
  darkMode,
  onAskCommand,
  onAddImage, // New prop
  chatResponse, // New prop
  setShowChatbox, // New prop
  showChatbox,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [reading, setReading] = useState(false); //put reading as well if needed
  const navigate = useNavigate();
  const { transcript, listening } = useSpeechRecognition();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [speechEnabled] = useState(() => {
    const savedPreference = localStorage.getItem("speechEnabled");
    return savedPreference === "true";
  });
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // New state for image URL

  useEffect(() => {
    speechSynthesis.cancel();
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const speakWithDelay = useCallback(
    (text: string): void => {
      if ("speechSynthesis" in window && speechEnabled) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 2;
        utterance.rate = 0.8;
        utterance.lang = "fr-FR";
        speechSynthesis.cancel();
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 200);
      } else {
        console.error("Your browser does not support speech synthesis.");
      }
    },
    [speechEnabled],
  );

  useEffect(() => {
    if (transcript) {
      const cleanedTranscript = transcript.replace(/\.$/g, "").toLowerCase();
      setSearchInput(cleanedTranscript);
      inputRef.current?.focus();
      speakWithDelay(
        "You have entered, " +
          transcript +
          ". Press enter to continue or tab to speak again",
      );
    }
  }, [transcript, speakWithDelay]);

  const handleMicButtonClick = () => {
    speechSynthesis.cancel();
    if (listening) {
      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 1000);
    } else {
      SpeechRecognition.startListening();
      setSearchInput("");
    }
  };

  const readHelpContent = useCallback(() => {
    if (speechEnabled) {
      const helpText = `
        /find to find and upload files from your computer or online storage.
        /ask to talk to the smart assistant for info, commands, or a chat buddy.
        /logout to logout
        /repeat to repeat the response
        /read to make it read things out loud.
        /pause to stop the reading.
        /manage to open Calendar.
        /add or /delete to add or remove items from your Calendar and Plans.
        /remind to set reminders.
        Press Enter to upload a file, give commands or send a message.
        Press and hold the Space key to speak.
        Press Escape to exit the instruction.
      `;
      const utterance = new SpeechSynthesisUtterance(helpText);
      utterance.pitch = 2;
      utterance.rate = 0.8;
      utterance.lang = "fr-FR";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);

  const toggleHelpModal = useCallback(() => {
    setHelpModalVisible((prevVisible) => {
      if (prevVisible) {
        speechSynthesis.cancel();
      } else {
        readHelpContent();
      }
      return !prevVisible;
    });
  }, [readHelpContent]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showChatbox) {
        // Add check for showChatbox
        toggleHelpModal();
      }
    },
    [toggleHelpModal, showChatbox], // Add showChatbox to dependencies
  );

  useEffect(() => {
    window.addEventListener(
      "keydown",
      handleEscape as unknown as EventListener,
    );
    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape as unknown as EventListener,
      );
    };
  }, [handleEscape]);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        setImageUrl(url); // Display the image immediately
        const imageName = file.name;
        speakText(`Ingesting the image ${imageName}, please wait`);
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
          onAddImage(url, Response);
        } else {
          console.error("Image upload failed:", uploadResponse.status);
        }
      } else if (fileType === "application/pdf") {
        setImageUrl(undefined); // Clear image state if PDF is uploaded
        onAddFile(url);

        const formData = new FormData();
        formData.append("file", file);

        setSearchInput("");
        speechSynthesis.cancel();

        const fileName = file.name;
        speakText(`Ingesting the file ${fileName}, please wait`);
        console.log("Ingesting file");

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
          speakText("chat_id not found");
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
          speakText(uploadResponse.data.message);
        } else {
          console.error(
            "File upload failed:",
            uploadResponse.status,
            uploadResponse.data,
          );
          speakText("Failed to ingest file");
        }
      } else {
        alert("Unsupported file type. Please upload a PDF or image file.");
      }
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Error processing file: " + error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value.trim() !== "") {
      speak("");
    } else {
      speakWithDelay("Enter your query and press Enter.");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const query = searchInput.trim();
      const pageNumberMatch = query.match(
        /page\s*number\s*(\d+)|page\s*(\d+)|page(\d+)|pg\s*(\d+)|pg(\d+)/i,
      );
      const question = query.replace(/\/?ask\s*/i, "");

      if (query.startsWith("/ask ") || query.startsWith("ask ")) {
        if (imageUrl) {
          speakText("Please select a PDF file to use the /ask command.");
        } else {
          if (pageNumberMatch) {
            const pageNumber = parseInt(
              pageNumberMatch[1] ||
                pageNumberMatch[2] ||
                pageNumberMatch[3] ||
                pageNumberMatch[4] ||
                pageNumberMatch[5],
              10,
            );
            onAskCommand(question, pageNumber); // Include page number
          } else {
            onAskCommand(question, -1); // Use -1 or any value to indicate no page number
          }
        }
        setSearchInput("");
      } else if (query === "/find" || query === "find") {
        fileInputRef.current?.click();
        setSearchInput("");
        speak("Please choose your file, you may search the file by its name.");
      } else if (query === "/logout") {
        handleLogout();
        setSearchInput("");
      } else if (query === "/repeat" || query === "repeat") {
        if (!showChatbox) {
          setShowChatbox(true);
        }
        speakText(chatResponse, true);
        setSearchInput("");
      } else {
        speak(
          "Invalid query, please try again or press escape for help with the queries",
        );
        setSearchInput("");
      }
    }
  };

  const handleLogout = async () => {
    const idCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)id\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    if (!idCookie) {
      console.error("No ID cookie found");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/logout",
        { id: idCookie },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        document.cookie = "id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie =
          "chat_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.clear();
        navigate("/sign-in");
        speak("Logging Out");
        console.log("Logout successful");
      } else {
        speak("Log Out failed, try again");
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const speakText = (text: string, reset = false) => {
    if (reset) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 2;
    utterance.rate = 0.8;
    utterance.lang = "fr-FR";
    utterance.onend = () => {
      console.log("Reading finished");
      setReading(false);
      console.log(reading);
    };
    speechSynthesis.speak(utterance);
    setReading(true);
    console.log(reading);
  };

  const speak = (text: string): void => {
    if ("speechSynthesis" in window && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 2;
      utterance.rate = 0.8;
      utterance.lang = "fr-FR";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      console.error("Your browser does not support speech synthesis.");
    }
  };

  return (
    <header
      className={`header mt-2 flex items-center justify-between p-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="toggle-container" aria-hidden="true">
        <label
          className="switch"
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
        >
          <input
            onFocus={() =>
              speak("Press space to toggle between light and dark mode")
            }
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="ml-10 flex flex-grow items-center gap-4">
        <div className="inputbox relative max-w-screen-lg flex-grow">
          <input
            type="text"
            placeholder="Type '/find' to find and upload files"
            className="search-input w-full rounded-lg border-2 border-gray-400 p-3 pl-10 pr-10 text-xl"
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            aria-label="Search bar"
          />
          <button
            className="mic absolute inset-y-0 right-16 pl-2 text-gray-500"
            onClick={handleMicButtonClick}
            onFocus={() => speak("Press space to speak to the chatbot")}
            aria-label="Activate microphone"
          >
            <img src={microphoneIcon} alt="Microphone" className="h-6 w-6" />
          </button>
          <button
            className="absolute inset-y-0 right-4 pr-2 text-gray-500"
            aria-label="Open scanner"
          >
            <img src={scannerIcon} alt="Scanner" className="h-6 w-6" />
          </button>
        </div>
        <button
          className="help-button rounded-lg bg-primary-blue px-4 py-3 text-xl text-white"
          onFocus={() =>
            speak(
              "This is the help section, press space to view and listen to the commands and press escape to exit.",
            )
          }
          onClick={toggleHelpModal}
          aria-label="Open help modal"
        >
          Help
        </button>
      </div>
      <div className="ml-2 hidden items-center lg:flex">
        <img src="/assets/rayologo.png" alt="Logo" className="h-12 w-12" />
        <span className="ml-2 mr-5 text-3xl font-bold">Rayo</span>
      </div>
      {isHelpModalVisible && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm backdrop-filter">
          <div className="box-background relative z-50 rounded-lg shadow-lg">
            <button
              onClick={toggleHelpModal}
              className="close-button absolute right-0 top-0 mr-2 mt-1 text-white"
              aria-label="Close help modal"
            >
              &times;
            </button>
            <div className="box-text text-white">
              <p className="command-text">
                <span className="key-text">/find</span> to find and upload files
                from your computer or online storage.
              </p>
              <p className="command-text">
                <span className="key-text">/ask</span> to talk to the smart
                assistant for info, commands, or a chat buddy.
              </p>
              <p className="command-text">
                <span className="key-text">/logout</span> to logout.
              </p>
              <p className="command-text">
                <span className="key-text">/repeat</span> to repeat the
                response.
              </p>
              <p className="command-text">
                <span className="key-text">/read</span> to make it read things
                out loud.
              </p>
              <p className="command-text">
                <span className="key-text">/pause</span> to stop the reading.
              </p>
              <p className="command-text">
                <span className="key-text">/manage</span> to open Calendar.
              </p>
              <p className="command-text">
                <span className="key-text">/add</span> or{" "}
                <span className="key-text">/delete</span> to add or remove items
                from your Calendar and Plans.
              </p>
              <p className="command-text">
                <span className="key-text">/remind</span> to set reminders
              </p>
              <p className="command-text">
                Press <span className="key-text">Enter</span> to upload a file,
                give commands or send a message.
              </p>
              <p className="command-text">
                Press and hold the <span className="key-text">Space</span> key
                to speak.
              </p>
              <p className="command-text">
                Press <span className="key-text">Escape</span> to exit the
                instruction.
              </p>
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept="application/pdf,image/*"
      />
    </header>
  );
};

export default Header;
