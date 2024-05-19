import { useState, useEffect } from "react";

const useHasBeenGreeted = (): [boolean, () => void] => {
  const [hasBeenGreeted, setHasBeenGreeted] = useState<boolean>(false);

  useEffect(() => {
    const greeted = localStorage.getItem("hasBeenGreeted") === "true";
    setHasBeenGreeted(greeted);
  }, []);

  const markAsGreeted = () => {
    localStorage.setItem("hasBeenGreeted", "true");
    setHasBeenGreeted(true);
  };

  return [hasBeenGreeted, markAsGreeted];
};

export default useHasBeenGreeted;
