import { useEffect, useState } from "react";
import backgroundBlob from "/assets/PoseidonsRealm.png";
import "@/styles/invite.css";

const Invite = () => {
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
    <div className="invite-container" role="main">
      <div
        className="animation-line"
        style={{ animationDuration: `${animationDuration}ms` }}
      ></div>
      <img
        src={backgroundBlob}
        alt="Decorative blob shape"
        className="blob-image-2"
        aria-hidden="true"
      />
      <div className="invite-text">
        <p
          className="lets-make-web-browsing"
          aria-label="Let's make web browsing"
        >
          Let's make
          <br />
          web browsing
        </p>
        <p className="fun-and-simple">
          <span className="text-white-italic">Fun</span> and{" "}
          <span className="text-white-italic">Simple</span>
        </p>
        <p className="together">together.</p>
      </div>
    </div>
  );
};

export default Invite;
