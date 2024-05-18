import React, { useState, useEffect, useRef } from "react";
import "@/styles/chatbox.css";

interface ChatBoxProps {
  question: string;
  response: string;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ question, response, onClose }) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track speaking status
  const [currentResponse, setCurrentResponse] = useState(""); // New state for current response

  useEffect(() => {
    // Clear the current response when a new question is received
    setCurrentResponse("");
    cancelSpeech(); // Cancel the existing speech when a new question is received
  }, [question]);

  const cancelSpeech = () => {
    if (utteranceRef.current) {
      speechSynthesis.cancel();
      utteranceRef.current.onend = null;
      utteranceRef.current = null;
    }
  };
  const speakText = (text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setIsSpeaking(true); // Set isSpeaking to true when speech starts
    };
    utterance.onend = () => {
      console.log("Reading finished");
      setIsSpeaking(false); // Set isSpeaking to false when speech ends
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentResponse(response);
      speakText(response);
    }, 2000); // 2000 ms -> 2 second

    return () => {
      clearTimeout(timer); // Clean up the timer on unmount
      cancelSpeech(); // Cancel speech when the component unmounts
    };
  }, [response]);

  const chatboxClass = isSpeaking ? "chatbox speaking" : "chatbox";

  useEffect(() => {
    return () => {
      // Cancel speech when the component unmounts
      if (utteranceRef.current) {
        speechSynthesis.cancel();
        utteranceRef.current.onend = null;
        utteranceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={chatboxClass}>
      <div className="chatbox-header">
        <button className="chatbox-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="chatbox-body">
        <div className="chatbox-question">{question}</div>
        <div className="chatbox-response">{currentResponse}</div>
      </div>
    </div>
  );
};

export default ChatBox;
