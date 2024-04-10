import { useEffect, useState } from "react";
import blobImage from "/assets/Cosmicbutterfly1.png";
import "@/styles/greetings.css";

const Greetings = () => {
  const [animationDuration, setAnimationDuration] = useState(0);

  useEffect(() => {
    // Set the animation duration
    const duration = 4000; // 4 seconds
    setAnimationDuration(duration);

    // Clear the animation duration after it finishes
    const timer = setTimeout(() => {
      setAnimationDuration(0);
    }, duration);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="greetings-container">
      <div
        className="animation-line"
        style={{ animationDuration: `${animationDuration}ms` }}
      ></div>
      <img
        src={blobImage}
        alt="Blob Shape"
        className="blob-image"
        aria-hidden="true"
      />
      <div className="greetings-text">
        <p className="hi-there">Hi there,</p>
        <p className="welcome-text">Welcome to</p>
        <p className="rayo">Rayo.</p>
      </div>
    </div>
  );
};

export default Greetings;
