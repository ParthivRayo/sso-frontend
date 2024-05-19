import React from "react";
import Chatbox from "../ui/ChatBox"; // Make sure path is correct
import "@/styles/maincontent.css";

interface MainContentProps {
  file: string | null;
  showChatbox: boolean;
  question: string;
  response: string;
  onCloseChatbox: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add this prop
  imageUrl?: string; // New prop
  isImage?: boolean; // New prop to indicate if the content is an image
}

const MainContent: React.FC<MainContentProps> = ({
  file,
  showChatbox,
  question,
  response,
  onCloseChatbox,
  onFileSelect, // Destructure the prop
  imageUrl, // New prop
  isImage, // New prop
}) => {
  return (
    <main className="main-content">
      {!file && !imageUrl && (
        <div
          className="flex h-full w-full items-center justify-center"
          onClick={() => document.getElementById("fileInput")?.click()} // Add click handler
        >
          <p
            style={{
              fontSize: "1.2rem",
              margin: "5px",
              textAlign: "justify",
              cursor: "pointer",
            }}
          >
            No file selected. Please click here to choose a file.
          </p>
        </div>
      )}
      {file && (
        <div className="pdf-container">
          <object data={file} type="application/pdf" className="h-full w-full">
            <p>
              Your browser does not support PDFs or there was an error loading
              the PDF. You can download the PDF to view it:{" "}
              <a href={file}>Download PDF</a>.
            </p>
          </object>
        </div>
      )}
      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
        </div>
      )}
      {showChatbox && (
        <Chatbox
          question={question}
          response={response}
          onClose={onCloseChatbox}
          isImage={!!isImage} // Pass the isImage prop
        />
      )}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileSelect} // Add onChange handler
        accept="application/pdf,image/*"
      />
    </main>
  );
};

export default MainContent;
