import React from "react";
import Chatbox from "../ui/ChatBox"; // Make sure path is correct

interface MainContentProps {
  file: string | null;
  showChatbox: boolean;
  question: string;
  response: string;
  onCloseChatbox: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  file,
  showChatbox,
  question,
  response,
  onCloseChatbox,
}) => {
  return (
    <main className="main-content">
      {file ? (
        <div className="pdf-container">
          <object data={file} type="application/pdf" className="h-full w-full">
            <p>
              Your browser does not support PDFs or there was an error loading
              the PDF. You can download the PDF to view it:{" "}
              <a href={file}>Download PDF</a>.
            </p>
          </object>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p>No file selected.</p>
        </div>
      )}
      {showChatbox && (
        <Chatbox
          question={question}
          response={response}
          onClose={onCloseChatbox}
        />
      )}
    </main>
  );
};

export default MainContent;
