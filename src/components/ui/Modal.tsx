import React, { useEffect, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  onConfirm: () => void;
  onDeny: () => void;
}

const Modal: React.FC<ModalProps> = ({ onConfirm, onDeny }) => {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Function to handle speech synthesis
    const speak = () => {
      if ("speechSynthesis" in window) {
        const message =
          "Do you have a screen reader and wish to disable additional voice guidance? Press enter to disable it and tab plus enter to continue with voice guidance.";
        const utterance = new SpeechSynthesisUtterance(message);
        //utterance.pitch = 2;
        utterance.rate = 0.8;
        //utterance.lang = "fr-FR";
        speechSynthesis.speak(utterance);
      }
    };

    speak();
    // Focus the first button when the component mounts
    firstButtonRef.current?.focus();
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="speech enabling modal"
      aria-describedby="speech enabling modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "500px",
          margin: "20px",
          textAlign: "center",
        }}
      >
        <p
          id="modal-heading"
          style={{
            marginBottom: "1rem",
            fontWeight: "bold",
            color: "black",
            fontSize: "1.2rem",
          }}
        >
          Do you have a screen reader and wish to disable additional voice
          guidance?
        </p>
        <Button
          aria-label="Yes, disable voice guidance"
          ref={firstButtonRef}
          onClick={() => {
            onConfirm();
            speechSynthesis.cancel();
            speechSynthesis.speak(
              new SpeechSynthesisUtterance("Disabling speech"),
            );
          }}
          className={cn(buttonVariants({ variant: "blue" }))}
        >
          Yes, disable voice guidance
        </Button>
        <Button
          aria-label="No, continue with voice guidance"
          onClick={() => {
            onDeny();
            speechSynthesis.cancel();
            speechSynthesis.speak(
              new SpeechSynthesisUtterance("Enabling speech"),
            );
          }}
          className={cn(buttonVariants({ variant: "pink" }))}
        >
          No, continue with voice guidance
        </Button>
      </div>
    </div>
  );
};

export default Modal;
